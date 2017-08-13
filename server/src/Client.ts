import * as WebSocket from 'ws'
import * as Protocol from './Protocol'
import { ProtocolHandler } from './Protocol'
import { App } from './app'
import { Logger } from './Logger'
const logger = new Logger('Client')
const Type = ProtocolHandler.Type
interface SubscribePackage {
  id: number
  args: any[]
  name: string
}
interface SubscribeAllPackage {
  items: SubscribePackage[]
}
interface UnsubscribePackage {
  id: number
}
export class Client extends ProtocolHandler {
  idMap: Map<number, SubscribePackage> = new Map()
  constructor (private app: App, ws: WebSocket) {
    super(ws)
  }
  @Type('DoCommand')
  async onDoCommand ({deviceID, typeID, cmdID}: any) {
    let device = this.app.getDevice(deviceID)
    const resp = await device.doCommand(typeID, cmdID)
    return resp
  }
  @Type('GetDeviceDetail')
  onGetDeviceDetail ({deviceId}: any) {
    let ret = this.app.getDevice(deviceId)
    return {
      type: 'DeviceDetail',
      detail: ret
    }
  }
  @Type('SubscribeAll')
  onSubscribeAll ({items}: SubscribeAllPackage) {
    for (let item of items) {
      this.onSubscribe(item)
    }
  }
  @Type('Subscribe')
  onSubscribe ({id, args, name}: SubscribePackage) {
    const dataSource = this.app.getDataSource(name)
    let aid = dataSource.subscribe(...args, (data: any) => {
      try {
        this.send({
          type: 'Data',
          id: id,
          value: data
        })
      } catch (e) {
        this.reset()
      }
    })
    this.idMap.set(id, {
      id: aid,
      name: name,
      args
    })
  }
  @Type('Unsubscribe')
  onUnsubscribe ({id}: UnsubscribePackage) {
    const item = this.idMap.get(id)
    const aid = item.id
    this.idMap.delete(id)
    this.app.getDataSource(item.name).unsubscribe(aid)
  }
  onClose (code: any, msg: any) {
    super.onClose(code, msg)
    this.app.removeClient(this)
    for (let key of this.idMap.keys()) {
      this.onUnsubscribe({id: key})
    }
  }
  onError (err: Error) {
    super.onError(err)
    this.app.removeClient(this)
  }
}
