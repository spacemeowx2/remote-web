export interface ILoggerFlags {
  enableLog: boolean
  enableDebug: boolean
  enableWarn: boolean
  enableError: boolean
}
let globalFlags: ILoggerFlags = {
  enableDebug: false,
  enableLog: false,
  enableWarn: true,
  enableError: true
}
export function setGlobalFlags (flags: ILoggerFlags) {
  globalFlags = flags
}
export function enableAll () {
  globalFlags = {
    enableDebug: true,
    enableLog: true,
    enableWarn: true,
    enableError: true
  }
}
export class Logger implements ILoggerFlags {
  enableDebug: boolean = null
  enableLog: boolean = null
  enableWarn: boolean = null
  enableError: boolean = null
  constructor (private _tag: string) {
    this._tag = `[${_tag}]`
  }
  static enableAll () {
    enableAll()
  }
  get tag () {
    return this._tag
  }
  get _enableDebug () {
    return (this.enableDebug === null) ? globalFlags.enableDebug : this.enableDebug
  }
  get _enableLog () {
    return (this.enableLog === null) ? globalFlags.enableLog : this.enableLog
  }
  get _enableWarn () {
    return (this.enableWarn === null) ? globalFlags.enableWarn : this.enableWarn
  }
  get _enableError () {
    return (this.enableError === null) ? globalFlags.enableError : this.enableError
  }
  debug (...args: any[]) {
    if (this._enableDebug) {
      console.log(this.tag, ...args)
    }
  }
  log (...args: any[]) {
    if (this._enableLog) {
      console.log(this.tag, ...args)
    }
  }
  warn (...args: any[]) {
    if (this._enableWarn) {
      console.log(this.tag, ...args)
    }
  }
  error (...args: any[]) {
    if (this._enableError) {
      console.error(this.tag, ...args)
    }
  }
}
