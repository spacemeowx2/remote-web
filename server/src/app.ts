require('source-map-support').install()
import * as Koa from 'koa'
import * as Route from 'koa-router'
import * as websockify from 'koa-websocket'
import { Device } from './Device'
import { IDevice } from './IDevice'
import { TestDevice } from './TestDevice'
import { Client } from './Client'
import { Logger } from './Logger'
import { DataSource } from './DataSource'
const logger = new Logger('Server')
Logger.enableAll()

function removeArray<T> (ary: T[], element: T) {
  while (true) {
    const i = ary.indexOf(element)
    if (i === -1) {
      return
    } else {
      ary.splice(i, 1)
    }
  }
}

class DeviceMap extends Map<string, IDevice> {
  constructor (private app: App) {
    super()
  }
  get (key: string) {
    return super.get(key)
  }
  add (device: IDevice) {
    this.set(device.deviceID, device)
  }
  set (key: string, value: IDevice) {
    let ret = super.set(key, value)
    this.app.onUpdateDevice()
    this.app.getDataSource('DeviceDetail').publish(value, key)
    return ret
  }
  delete (key: string) {
    return super.delete(key)
  }
}

export class App {
  private app = websockify(new Koa())
  private devices: DeviceMap = new DeviceMap(this)
  private clients: Client[] = []
  private dataSources: Map<string, DataSource<any>> = new Map()
  constructor () {
    this.dataSources.set('sensor', new DataSource())
    this.dataSources.set('DeviceList', new DataSource())
    this.dataSources.set('DeviceDetail', new DataSource())

    this.devices.add(new TestDevice(this))

    this.initRouter()
    this.app.listen(3000)
    logger.log('Server start listening on port 3000')
  }
  onUpdateDevice () {
    let devices = Array.from(this.devices.values())
    this.getDataSource('DeviceList').publish(devices.map(i => ({
      id: i.deviceID,
      name: i.deviceName
    })))
  }
  getDataSource (name: string) {
    return this.dataSources.get(name)
  }
  removeClient (client: Client) {
    removeArray(this.clients, client)
  }
  initRouter () {
    const route = new Route()
    route.all('/device', async (ctx, next) => {
      logger.debug('New Device')
      this.devices.add(new Device(this, ctx.websocket))
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
