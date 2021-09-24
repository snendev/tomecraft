import { Application, Status } from 'oak'

//// import any necessary wasm file here
// import init from '~/common/wasm.js'

import apiRouter from './routes/api.ts'
import staticRouter from './routes/static.tsx'

const app = new Application()

app.addEventListener("error", (event) => {
  console.error(event.error);
})

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.response.body = "Internal server error";
    throw error;
  }
});
app.use((ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', '*')
  // avoid CSP concerns
  // ctx.response.headers.delete("content-security-policy");
  console.log(ctx.request.url.pathname)
  return next()
})

app.use(apiRouter.routes())
app.use(apiRouter.allowedMethods())

app.use(staticRouter.routes())
app.use(staticRouter.allowedMethods())

// 404
app.use((context) => {
  context.response.status = Status.NotFound
  context.response.body = `"${context.request.url}" not found`
})

const port = +(Deno.env.get('PORT') ?? 8080)
console.log(`Listening on port ${port}...`)
app.listen(`:${port}`)
