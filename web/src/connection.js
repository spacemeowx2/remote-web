export class Connection {
  constructor (url) {
    this._url = url
    this.connecting = false
    this.connect(this._url)
    this.listener = null
  }
  get url () {
    return this._url
  }
  set url (v) {
    if (v !== this._url) {
      this._url = v
      this.connect()
    }
  }
  connect () {
    this.connecting = true
    this._close()
    this.ws = new WebSocket(this._url)
    this.ws.onclose = () => this.onClose()
    this.ws.onerror = () => {
      this.connecting = false
      this.onClose()
    }
    this.ws.onmessage = (msg) => {
      let data = msg.data
      try {
        data = JSON.parse(data)
      } catch (e) {
        return
      }
      this.onMessage(data)
    }
    this.ws.onopen = () => {
      this.connecting = false
      this.onOpen()
    }
  }
  _close () {
    if (this.ws) {
      this.ws.close()
    }
  }
  onClose () {
    setTimeout(() => {
      if (this.connecting) {
        return
      }
      this.connect()
    }, 1000)
    if (this.listener) {
      this.listener.onClose()
    }
  }
  onMessage (data) {
  }
  onOpen () {
    if (this.listener) {
      this.listener.onOpen()
    }
  }
  send (data) {
    this.ws.send(JSON.stringify(data))
  }
}
export class Subscriptor extends Connection {
  constructor (url) {
    super(url)
    this.items = []
    this.map = {}
    this.nextId = 1
  }
  onOpen () {
    if (this.items.length > 0) {
      this.send({
        type: 'SubscribeAll',
        items: this.items
      })
    }
  }
  onMessage (data) {
    if (data.type === 'Data') {
      this.map[data.id].callback(data.value)
    }
  }
  unsubscribe (id) {
    const item = this.items.find(i => i.id === id)
    if (!item) {
      return false
    }
    try {
      this.send({
        type: 'Unsubscribe',
        id
      })
      this.items.splice(this.items.indexOf(item), 1)
      delete this.map[id]
      return true
    } catch (e) {
      console.log('fail to unsubscribe')
      return false
    }
  }
  subscribe (name, ...args) {
    const callback = args[args.length - 1]
    const item = {
      id: this.nextId++,
      name,
      args: args.slice(0, args.length - 1),
      callback
    }
    this.items.push(item)
    this.map[item.id] = item
    try {
      this.send({
        type: 'Subscribe',
        name: item.name,
        args: item.args
      })
    } catch (e) {
      console.log('fail to subscribe')
    }
    return item.id
  }
}