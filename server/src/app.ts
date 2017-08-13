require('source-map-support').install()
import * as Koa from 'koa'
import * as Route from 'koa-router'
import * as websockify from 'koa-websocket'
import { Device } from './Device'
import { IDevice } from './IDevice'
import { TestDevice } from './TestDevice'
import { Client } from './Client'
import { Logger } from './Logger'
import { DataSource, DataSourceMap, DataNode } from './DataSource'
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

class DeviceMap extends DataSourceMap<string, IDevice> {
  constructor (dataSource: DataSource<IDevice>) {
    super(dataSource)
  }
  add (device: IDevice) {
    this.set(device.deviceID, device)
  }
}

export class App {
  private app = websockify(new Koa())
  private devices: IDevice[] = []
  private deviceMap: DeviceMap
  private clients: Client[] = []
  private dataSources: Map<string, DataSource<any>> = new Map()
  constructor () {
    this.dataSources.set('Sensor', new DataSource())
    this.dataSources.set('DeviceList', new DataSource())
    this.dataSources.set('DeviceDetail', new DataSource())
    const deviceList: DataSource<any[]> = this.getDataSource('DeviceList')
    const deviceDetail: DataSource<IDevice> = this.getDataSource('DeviceDetail')
    this.deviceMap = new DeviceMap(deviceDetail)
    deviceDetail.subscribe((data: DataNode<IDevice>) => {
      let devices = Array.from(this.deviceMap.values())
      devices = devices.filter(i => !!(i.deviceID && i.deviceName))
      deviceList.publish(devices.map(i => ({
        id: i.deviceID,
        name: i.deviceName
      })))
    })

    this.devices.push(new TestDevice(this, 'test'))

    this.initRouter()
    this.app.listen(3000)
    logger.log('Server start listening on port 3000')
  }
  getDevice (deviceID: string) {
    return this.deviceMap.get(deviceID)
  }
  deviceAuthed (device: IDevice) {
    this.deviceMap.add(device)
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
      this.devices.push(new Device(this, ctx.websocket))
    })

    route.all('/client', async (ctx, next) => {
      logger.debug('New Client')
      this.clients.push(new Client(this, ctx.websocket))
    })

    route.all('/repeat', async (ctx, next) => {
      logger.debug('New Repeat')
      ctx.websocket.on('message', message => {
        console.log('Repeat: ', message)
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
