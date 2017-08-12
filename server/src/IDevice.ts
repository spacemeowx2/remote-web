import * as Protocol from './Protocol'

export interface IDevice {
  deviceName: string
  deviceID: string
  supportCommand: Protocol.CommandCatelog[]
  sensorTypes: Protocol.SensorType[]
}
