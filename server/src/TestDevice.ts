import { IDevice } from './IDevice'
import * as Protocol from './Protocol'

export class TestDevice implements IDevice {
  name: string
  devType: string
  supportCommand: Protocol.CommandCatelog[]
  sensorTypes: string[]
  constructor () {
    //
  }
}
