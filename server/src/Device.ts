import * as WebSocket from 'ws'
import * as Protocol from './Protocol'
import { ProtocolHandler } from './Protocol'
import { App } from './app'
import { IDevice } from './IDevice'
import { Logger } from './Logger'
import { DataSource } from './DataSource'
const logger = new Logger('Client')
const Type = ProtocolHandler.Type

export class Device extends ProtocolHandler implements IDevice {
  deviceName: string
  deviceID: string
  supportCommand: Protocol.CommandCatelog[]
  sensorTypes: Protocol.SensorType[]
  sensorSource: DataSource<number>
  private nextCommandID = 1
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
  async doCommand (typeID: string, cmdID: string) {
    try {
      const id = this.nextCommandID++
      this.send({
        type: 'UserCommand',
        ID: id,
        typeID,
        cmdID
      })
      let resp = await this.waitPackage('UserCommandResponse', {
        ID: id
      })
      return resp
    } catch (e) {
      console.error(e)
    }
  }
  @Type('Sensor')
  onSensor (data: Protocol.PSensor) {
    console.log('Sensor', data)
    this.sensorSource.publish(data.value, this.deviceID, data.typeID)
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
    this.sensorSource = this.app.getDataSource('Sensor')
    for (let sensor of this.sensorTypes) {
      this.sensorSource.publish(null, this.deviceID, sensor.typeID)
    }
    this.app.deviceAuthed(this)
  }
  onClose (code: any, msg: any) {
    super.onClose(code, msg)
  }
  onError (err: Error) {
    super.onError(err)
  }
}
