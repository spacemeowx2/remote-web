import * as Protocol from './Protocol'

export interface IDevice {
  name: string
  devType: string
  supportCommand: Protocol.CommandCatelog[]
  sensorTypes: string[]
}
