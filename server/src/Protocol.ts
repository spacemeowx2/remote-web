export interface Package {
  type: string
}
export interface PHandshake extends Package {
  type: 'Handshake'
  deviceId: string // 每个设备唯一
  deviceName: string
  supportCommand: CommandCatelog[]
  sensorTypes: SensorType[]
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
  typeId: number
  Value: number
}
export interface PUserCommand extends Package {
  type: 'UserCommand'
  id: number
  typeID: number
  cmdID: number
}
export interface PUserCommandResponse extends Package {
  type: 'UserCommandResponse'
  id: number
  success: boolean
  info: string
}
