import { IDevice } from './IDevice'
import * as WebSocket from 'ws'
import { Logger } from './Logger'
const logger = new Logger('Protocol')

export interface Package {
  type: string
}
export interface PHandshake extends Package, IDevice {
  type: 'Handshake'
}
export interface PHeartbeat extends Package {
  type: 'Heartbeat'
}
export interface SensorType {
  typeID: number
  typeName: string
  unit: string
}
export interface CommandCatelog {
  typeID: number
  typeName: string // show to user, supported by client
  commands: Command[]
}
export interface Command {
  cmdID: number
  cmdName: string // supported by client
}
export interface PSensor extends Package {
  type: 'Sensor'
  typeID: number
  value: number
}
export interface PUserCommand extends Package {
  type: 'UserCommand'
  ID: number
  typeID: number
  cmdID: number
}
export interface PUserCommandResponse extends Package {
  type: 'UserCommandResponse'
  ID: number
  success: boolean
  info: string
}

const TypeMap: Map<Function, Map<string, Function>> = new Map()
interface IWaitTemplate {
  callback: (data: Package) => void
  template: any
}
export class ProtocolHandler {
  private waitingMap: Map<string, IWaitTemplate[]> = new Map()
  constructor (private ws: WebSocket) {
    if (!ws) {
      return
    }
    ws.on('message', (data) => {
      logger.debug('on message')
      if (typeof data === 'string') {
        try {
          let obj = JSON.parse(data)
          this.onMessage(obj)
        } catch (e) {
          logger.debug('message JSON parse failed', e)
        }
      }
    })
    ws.on('close', (code, message) => this.onClose(code, message))
    ws.on('error', (err) => this.onError(err))
  }
  static Type (type: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const constructor: typeof ProtocolHandler = target.constructor
      let map = TypeMap.get(constructor)
      if (!map) {
        TypeMap.set(constructor, map = new Map())
      }
      map.set(type, target[propertyKey])
    }
  }
  waitPackage (type: string, template: any, timeout = 5000) {
    let waiting = this.waitingMap.get(type)
    if (!waiting) {
      this.waitingMap.set(type, waiting = [])
    }
    return new Promise<Package>((resolve, reject) => {
      const del = () => {
        const idx = waiting.indexOf(item)
        waiting.splice(idx, 1)
      }
      const item = {
        callback (data: Package) {
          del()
          resolve(data)
        },
        template
      }
      waiting.push(item)
      setTimeout(() => {
        del()
        reject()
      }, timeout)
    })
  }
  protected onError (err: Error) {
    logger.error('onError', err)
  }
  protected onClose (code: any, message: any) {
    logger.error('onClose', code, message)
  }
  protected async onMessage (data: Package) {
    const waiting = this.waitingMap.get(data.type)
    if (waiting && waiting.length > 0) {
      for (let item of waiting) {
        const t = item.template
        const d = data as any
        if (Object.keys(t).every(k => t[k] === d[k])) {
          item.callback(data)
          return
        }
      }
    }
    const map = TypeMap.get(this.constructor)
    const handler = map.get(data.type)
    if (!handler) {
      logger.error('The handler of type is not found', data.type)
      return
    }
    let response = handler.call(this, data)
    if (response instanceof Promise) {
      response = await response
    }
    if (response !== undefined) {
      this.send(response)
    }
  }
  protected send (data: any) {
    this.ws.send(JSON.stringify(data))
  }
  protected reset () {
    this.ws.close()
  }
}
