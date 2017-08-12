require('source-map-support').install()
import * as Koa from 'koa'
import * as Route from 'koa-router'
import * as websockify from 'koa-websocket'
import { Device } from './Device'
import { IDevice } from './IDevice'
import { TestDevice } from './TestDevice'
import { Client } from './Client'
import { Logger } from './Logger'
const logger = new Logger('Server')
Logger.enableAll()

export class App {
  private app = websockify(new Koa())
  private devices: IDevice[] = []
  private clients: Client[] = []
  constructor () {
    this.devices.push(new TestDevice(this))
    this.initRouter()
    this.app.listen(3000)
    logger.log('Server start listening on port 3000')
  }
  getDeviceList () {
    return this.devices.filter(i => i.deviceID)
  }
  initRouter () {
    const route = new Route()
    route.all('/device', async (ctx, next) => {
      logger.debug('New Device')
      this.devices.push(new Device(this, ctx.websocket))
    })

    route.all('/client', async (ctx, next) => {
      logger.debug('New Client')
      this.clients.push(new Client(this, ctx.websocket))
    })

    route.all('/repeat', async (ctx, next) => {
      logger.debug('New Repeat')
      ctx.websocket.on('message', message => {
        ctx.websocket.send(message)
      })
    })

    this.app.ws.use(async (ctx, next) => {
      try {
        await next()
      } catch (e) {
        logger.error(e)
      }
    })
    this.app.ws.use(route.routes())
  }
}
const a = new App()
