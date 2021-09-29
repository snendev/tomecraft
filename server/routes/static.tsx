// import React from 'react'
// import ReactDOMServer from 'react-dom/server'
import { contentType } from 'media-types'
import { Router } from 'oak'

// import App from '~/client/App.tsx'

function indexOfAll(source: string, query: string): number[] {
  let currentPosition = 0
  const buffer: number[] = []
  while (currentPosition !== -1) {
    const lastPosition = currentPosition
    currentPosition = source.indexOf(query, lastPosition + 1)
    if (currentPosition !== -1) buffer.push(currentPosition)
  }
  // ensure it's sorted in case while loop betrays us
  return buffer.sort()
}

interface ResolvedEnvVar {
  callsiteBounds: [number, number]
  varname: string
  value?: string
}

const ENV_SEARCH_STRING = "Deno.env.get(\""
const ENV_SEARCH_END_STRING = "\")"

function resolveClientDenoEnvVars(source: string): string {
  const startIndices = indexOfAll(source, ENV_SEARCH_STRING)
  const resolved = startIndices.map((startIndex) => {
    const endIndex = source.indexOf(ENV_SEARCH_END_STRING, startIndex)
    const varname = source.slice(startIndex + ENV_SEARCH_STRING.length, endIndex)
    const bounds = [startIndex, endIndex + ENV_SEARCH_END_STRING.length]
    const value = Deno.env.get(varname)
    return {
      callsiteBounds: bounds,
      varname,
      value: `"${value}"`,
    }
  })

  function replaceBounds(input: string, newText: string | undefined, start: number, end: number) {
    return `${input.slice(0, start)}${newText}${input.slice(end)}`
  }

  // reassemble source code by reversing the order and replacing strings
  const reassembledSource = resolved.reverse().reduce(
    (currentSource, {callsiteBounds, value, varname}) => {
      if (value === undefined)
        throw new Error(`Deno env variable ${varname} found in client code but not provided to server.`)
      return replaceBounds(currentSource, value, callsiteBounds[0], callsiteBounds[1])
    },
    source,
  )
  return reassembledSource
}

function mapDict<T, U>(
  dict: Record<string, T>,
  fn: (entry: [string, T], index: number) => [string, U],
): Record<string, U> {
  return Object.fromEntries(
    Object.entries(dict).map(fn)
  )
}

async function createClientBundle() {
  const {files} = await Deno.emit('server/client.tsx', {
    bundle: 'module',
    importMapPath: 'import_map.json',
    compilerOptions: {
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      jsx: "react",
      strictPropertyInitialization: false,
    },
  })
  const bundle = mapDict(files, ([path, source], i) => {
    const resolved = resolveClientDenoEnvVars(source)
    if (Deno.env.get("DEBUG")) {
      Deno.writeTextFileSync(`debug/output${i}.js`, source)
      Deno.writeTextFileSync(`debug/resolved${i}.js`, resolved)
    }
    return [path, resolved]
  })
  return bundle
}

const bundle = await createClientBundle()

function getBundleFile(path: string) {
  return bundle[`deno:///${path}`]
}

function getAssetFile(file: string): Uint8Array | null {
  try {
    const asset = Deno.readFileSync(`assets/${file}`)
    return asset
  } catch {
    return null
  }
}

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tomecraft</title>
    <meta name="description" content="Tactical CCG" />
    <link href="styles.css" rel="stylesheet" type="text/css">
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      body, #root {
        height: 100vh;
        width: 100vw;
      }
    </style>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
    </div>
    <script src="/bundle.js"></script>
  </body>
</html>
`

const staticRouter = new Router()

// handle static routes by proxying to web resources
// https://deno.com/deploy/docs/serve-static-assets
staticRouter
  .get('/', (ctx) => {
    ctx.response.body = html
  })
  .get('/styles.css', (ctx) => {
    const styles = Deno.readTextFileSync('client/styles.css')
    const contentTypeValue = contentType('styles.css')
    const headers = new Headers(ctx.response.headers)
    if (contentTypeValue) {
      headers.set('Content-Type', contentTypeValue)
    }
    ctx.response.headers = headers
    ctx.response.body = styles
  })
  .get('/assets/:pathname', async (ctx, next) => {
    const assetPath = ctx.params.pathname
    if (!assetPath) {
      return await next()
    }

    const file = getAssetFile(assetPath)
    if (!file) {
      return await next()
    }

    const filePathParts = assetPath.split('/')
    const contentTypeValue = contentType(filePathParts[filePathParts.length - 1])
    const headers = new Headers(ctx.response.headers)
    if (contentTypeValue) {
      headers.set('Content-Type', contentTypeValue)
    }
    ctx.response.headers = headers
    ctx.response.body = file
  })
  .get('/:pathname', async (ctx, next) => {
    const pathname = ctx.params.pathname
    if (!pathname) {
      return await next()
    }

    const file = getBundleFile(pathname)
    if (!file) {
      return await next()
    }

    // get just the last bit so we can determine the correct filetype
    // contentType from media-types@v2.10.0 checks path.includes('/')
    const filePathParts = pathname.split('/')
    const contentTypeValue = contentType(filePathParts[filePathParts.length - 1])
    const headers = new Headers(ctx.response.headers)
    if (contentTypeValue) {
      headers.set('Content-Type', contentTypeValue)
    }
    ctx.response.headers = headers
    if (pathname.endsWith('.js')) {
      ctx.response.type = 'application/javascript'
    }
    ctx.response.body = file
  })

export default staticRouter
