import { Router } from 'oak'

function handleSocket(socket: WebSocket) {
  console.log(socket)
}

const apiRouter = new Router()

apiRouter
  .get('/api/ws', async (context) => {
    if (!context.isUpgradable) throw new Error('Context not upgradable.')
    const ws = await context.upgrade()
    handleSocket(ws)
  })
  .get('/api/hello', (context) => {
    context.response.body = "Hello world!";
  })

export default apiRouter
