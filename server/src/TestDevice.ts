import { IDevice } from './IDevice'
import { Device } from './Device'
import * as WebSocket from 'ws'
import * as Protocol from './Protocol'
import { App } from './app'

export class TestDevice extends Device {
  private timer: NodeJS.Timer
  constructor (app: App) {
    super(app, null)
    this.onHandshake({
      type: 'Handshake',
      deviceName: 'TestDevice',
      deviceID: 'testDevice',
      supportCommand: [{
        typeID: 1,
        typeName: '测试类别',
        commands: [{
          cmdID: 1,
          cmdName: '开机'
        }]
      }],
      sensorTypes: [{
        typeID: 1,
        typeName: '温度',
        unit: '℃'
      }, {
        typeID: 2,
        typeName: '湿度',
        unit: '%'
      }]
    })
    this.timer = setInterval(() => this.onInterval(), 1000)
  }
  onInterval () {
    // this.sensorSource.publish(25, this.deviceID, 1)
    // this.sensorSource.publish(60, this.deviceID, 2)
  }
}
