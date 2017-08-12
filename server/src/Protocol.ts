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
  Value: number
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
export class ProtocolHandler {
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
  protected onMessage (data: Package) {
    const map = TypeMap.get(this.constructor)
    const handler = map.get(data.type)
    if (!handler) {
      logger.error('The handler of type is not found')
      return
    }
    const response = handler.call(this, data)
    if (response !== undefined) {
      this.send(response)
    }
  }
  protected send (data: any) {
    this.ws.send(JSON.stringify(data))
  }
}
