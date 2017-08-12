import * as WebSocket from 'ws'
import * as Protocol from './Protocol'
import { ProtocolHandler } from './Protocol'
import { App } from './app'
import { IDevice } from './IDevice'
import { Logger } from './Logger'
const logger = new Logger('Client')
const Type = ProtocolHandler.Type

export class Device extends ProtocolHandler implements IDevice {
  static typeMap: Map<string, Function> = new Map()
  deviceName: string
  deviceID: string
  supportCommand: Protocol.CommandCatelog[]
  sensorTypes: Protocol.SensorType[]
  constructor (private app: App, ws: WebSocket) {
    super(ws)
  }
  toJSON (): IDevice {
    return {
      deviceName: this.deviceName,
      deviceID: this.deviceID,
      supportCommand: this.supportCommand,
      sensorTypes: this.sensorTypes
    }
  }
  @Type('Handshake')
  onHandshake (data: Protocol.PHandshake) {
    this.deviceName = data.deviceName
    this.deviceID = data.deviceID
    this.supportCommand = data.supportCommand.map(i => ({
      typeID: i.typeID,
      typeName: i.typeName,
      commands: i.commands.map(j => ({
        cmdID: j.cmdID,
        cmdName: j.cmdName
      }))
    }))
    this.sensorTypes = data.sensorTypes.map(i => ({
      typeID: i.typeID,
      typeName: i.typeName,
      unit: i.unit
    }))
    logger.debug('Handshake', JSON.stringify(this))
  }
  onClose (code: any, msg: any) {
    super.onClose(code, msg)
    this.app.removeDevice(this)
  }
  onError (err: Error) {
    super.onError(err)
    this.app.removeDevice(this)
  }
}
