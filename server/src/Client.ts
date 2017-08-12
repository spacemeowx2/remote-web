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
  @Type('SubscribeAll')
  onSubscribeAll ({items}: SubscribeAllPackage) {
    for (let item of items) {
      this.onSubscribe(item)
    }
  }
  @Type('Subscribe')
  onSubscribe ({id, args, name}: SubscribePackage) {
    let aid = this.app.getDataSource(name).subscribe(...args, (data: any) => {
      this.send({
        type: 'Data',
        id: id,
        value: data
      })
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
