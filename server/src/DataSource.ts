type TreeKey = string | number
interface ISubscriber {
  args: string[]
  id: number
  callback: Function
}
function getTimeStamp () {
  return Math.floor((new Date()).getTime() / 1000)
}
export class DataNode<T> {
  children?: {
    [key: string]: DataNode<T>
  }
  data?: T
  timestamp?: number
  toJSON () {
    let ret: any = {
      c: this.children,
      d: this.data
    }
    if (this.timestamp) {
      ret.t = getTimeStamp() - this.timestamp
    }
    return ret
  }
}
export class DataSource<T> {
  subscriber: Map<number, ISubscriber> = new Map()
  nextId = 1
  private root: DataNode<T> = new DataNode()
  private parent: WeakMap<DataNode<T>, DataNode<T>> = new WeakMap()
  private nodeSubscriber: WeakMap<DataNode<T>, ISubscriber[]> = new WeakMap()
  notify (cur: DataNode<T>) {
    const nodeSubscriber = this.nodeSubscriber
    while (cur) {
      if (nodeSubscriber.has(cur)) {
        for (let s of nodeSubscriber.get(cur)) {
          s.callback(cur)
        }
      }
      cur = this.parent.get(cur)
    }
  }
  publish (value: T, ...args: TreeKey[]) {
    let cur = this.gotoNode(this.root, args)
    cur.data = value
    cur.timestamp = getTimeStamp()
    this.notify(cur)
  }
  subscribe (...args: any[]) {
    if (args.length === 0) {
      throw new Error('need at least 1 params')
    }
    const callback = args[args.length - 1]
    args = args.slice(0, args.length - 1)
    const item: ISubscriber = {
      id: this.nextId++,
      args,
      callback
    }
    this.subscriber.set(item.id, item)

    let cur = this.gotoNode(this.root, args)
    let ary = this.nodeSubscriber.get(cur)
    if (!ary) {
      this.nodeSubscriber.set(cur, ary = [])
    }
    ary.push(item)
    this.notify(cur)
    return item.id
  }
  unsubscribe (id: number) {
    const item = this.subscriber.get(id)
    const args = item.args

    let cur = this.gotoNode(this.root, args)
    const ary = this.nodeSubscriber.get(cur)
    const idx = ary.indexOf(item)
    ary.splice(idx, 1)
    this.notify(cur)

    return this.subscriber.delete(id)
  }
  walkNode (cur: DataNode<T>, cb: (cur: DataNode<T>) => void) {
    cb(cur)
    if (cur.children) {
      for (let key of Object.keys(cur.children)) {
        const child = cur.children[key]
        this.walkNode(child, cb)
      }
    }
  }
  gotoNode (root: DataNode<T>, args: TreeKey[]) {
    let cur = root
    for (let arg of args) {
      if (!cur.children) {
        cur.children = {}
      }
      if (!cur.children[arg]) {
        let item = new DataNode<T>()
        cur.children[arg] = item
        this.parent.set(item, cur)
      }
      cur = cur.children[arg]
    }
    return cur
  }
}
export class DataSourceMap<T, U> extends Map<T, U> {
  constructor (
    private dataSource: DataSource<U>,
    private map: (key: T) => TreeKey[] = key => [key.toString()]
  ) {
    super()
  }
  get (key: T) {
    return super.get(key)
  }
  set (key: T, value: U) {
    let ret = super.set(key, value)
    this.update(key)
    return ret
  }
  delete (key: T) {
    let ret = super.delete(key)
    this.update(key)
    return ret
  }
  update (key: T) {
    this.dataSource.publish(this.get(key), ...this.map(key))
  }
}
