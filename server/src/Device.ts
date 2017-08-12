import * as WebSocket from 'ws'
import * as Protocol from './Protocol'
export class Device {
  constructor (public ws: WebSocket) {
    ws.on('message', (data) => {
      if (typeof data === 'string') {
        try {
          let obj = JSON.parse(data)
          this.onMessage(obj)
        } catch (e) {
          //
        }
      }
    })
  }
  onMessage (data: Protocol.Package) {
    if (data.type === 'Handshake') {
      let pkg = data as Protocol.PHandshake
      
    }
  }
}
