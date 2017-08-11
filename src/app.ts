import * as Koa from 'koa'
import * as Route from 'koa-router'
import * as websockify from 'koa-websocket'
const route = new Route()
const app = websockify(new Koa())

app.ws.use(async function (ctx, next) {
  console.log(1)
  ctx.websocket.send('Hello World')
  ctx.websocket.on('message', (message) => {
    console.log(2)
    console.log(message)
  })
})
app.listen(3000)
