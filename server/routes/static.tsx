// import React from 'react'
// import ReactDOMServer from 'react-dom/server'
import { contentType } from 'media-types'
import { Router } from 'oak'

// import App from '~/client/App.tsx'

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
  return files
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
    <title>Deno React Web Starter</title>
    <meta name="description" content="Template for SSR React apps with Deno, Oak, and Firebase." />
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
      ${ /* ReactDOMServer.renderToString(<App />) */ '' }
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
  // // serve wasm file
  // .get('/wasm.wasm', async (ctx) => {
  //   const headers = new Headers(ctx.response.headers)
  //   headers.set('Content-Type', 'application/wasm')
  //   ctx.response.headers = headers
  //   const body = await Deno.readFile('common/wasm/wasm_bg.wasm')
  //   ctx.response.body = body
  // })
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
