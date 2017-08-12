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
  constructor (private app: App, ws: WebSocket) {
    super(ws)
  }
  @Type('SubscribeAll')
  onSubscribeAll ({items}: SubscribeAllPackage) {
    //
  }
  @Type('Subscribe')
  onSubscribe ({id, args, name}: SubscribePackage) {
    //
  }
  @Type('Unsubscribe')
  onUnsubscribe ({id}: UnsubscribePackage) {
    //
  }
  onClose (code: any, msg: any) {
    super.onClose(code, msg)
    this.app.removeClient(this)
  }
  onError (err: Error) {
    super.onError(err)
    this.app.removeClient(this)
  }
}
