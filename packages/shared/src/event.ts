import type { IFun, IObject } from './is'

interface EventIFun extends IFun {
  fun?: IFun
}

interface EventEmitterEvents {
  [name: string]: [EventIFun, IObject][]
}

export class EventEmitter {
  public events: EventEmitterEvents

  constructor() {
    this.events = {}
  }

  public on(type: string, call: IFun, ctx: IObject = this) {
    if (!this.events[type]) {
      this.events[type] = []
    }

    this.events[type].push([call, ctx])

    return this
  }

  public once(type: string, call: IFun, ctx: IObject = this) {
    const compose = (...args: any[]) => {
      this.off(type, compose)

      call.apply(ctx, args)
    }

    compose.fun = call

    this.on(type, compose)

    return this
  }

  public off(type: string, call: IFun) {
    const events = this.events[type]

    if (!events) return this

    this.events[type] = events.filter(([fn]) => fn !== call && (!fn.fun || fn.fun !== call))

    if (!this.events[type].length) {
      delete this.events[type]
    }

    return this
  }

  public emit(type: string, ...args: any[]) {
    const events = this.events[type]

    if (!events) return

    events.slice().forEach(([call, ctx]) => {
      call.apply(ctx, args)
    })
  }

  public destroy() {
    this.events = {}
  }
}
