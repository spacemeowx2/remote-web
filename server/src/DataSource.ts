type TreeKey = string | number
interface ISubscriber {
  args: string[]
  id: number
  callback: Function
}
interface DataNode<T> {
  children?: {
    [key: string]: DataNode<T>
  }
  data?: T
}
export class DataSource<T> {
  subscriber: Map<number, ISubscriber> = new Map()
  nextId = 1
  private data: DataNode<T> = {}
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
    let cur = this.gotoNode(this.data, args)
    cur.data = value
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

    let cur = this.gotoNode(this.data, args)
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

    let cur = this.gotoNode(this.data, args)
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
        let item = {}
        cur.children[arg] = item
        this.parent.set(item, cur)
      }
      cur = cur.children[arg]
    }
    return cur
  }
}
