import * as WebSocket from 'ws'
import * as Protocol from './Protocol'
import { ProtocolHandler } from './Protocol'
import { App } from './app'
import { Logger } from './Logger'
const logger = new Logger('Client')
const Type = ProtocolHandler.Type

export class Client extends ProtocolHandler {
  static typeMap: Map<string, Function> = new Map()
  constructor (private app: App, ws: WebSocket) {
    super(ws)
  }
  @Type('GetDevice')
  getDevice () {
    return {
      type: 'DeviceList',
      devices: this.app.getDeviceList()
    }
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
