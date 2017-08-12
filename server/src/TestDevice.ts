import { IDevice } from './IDevice'
import { Device } from './Device'
import * as WebSocket from 'ws'
import * as Protocol from './Protocol'
import { App } from './app'

export class TestDevice extends Device {
  deviceName: string = 'TestDevice'
  deviceId: string = 'testDevice'
  supportCommand: Protocol.CommandCatelog[] = [{
    typeID: 1,
    typeName: '测试类别',
    commands: [{
      cmdID: 1,
      cmdName: '开机'
    }]
  }]
  sensorTypes: Protocol.SensorType[] = [{
    typeID: 1,
    typeName: '传感器',
    unit: '%'
  }]
  private timer: NodeJS.Timer
  constructor (app: App) {
    super(app, null)
    this.timer = setInterval(() => this.onInterval(), 1000)
  }
  onInterval () {
    //
  }
}
