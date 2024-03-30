import { RenderEvent, UI, UIData, dataProcessor, registerUI, surfaceType } from 'leafer-ui'

import type {
  ICanvasContext2D,
  IEventListenerId,
  ILeafer,
  ILeaferCanvas,
  IUIData,
  IUIInputData
} from '@leafer-ui/interface'

interface CurrentData {
  width: number
  height: number
  scaleX: number
  scaleY: number
  offsetX: number
  offsetY: number
}

interface IGridInputData extends IUIInputData {
  watchLeafer?: ILeafer
  lineStep?: number
  minScale?: number
}
interface IGridData extends IUIData {}

class GridData extends UIData implements IGridData {}

@registerUI()
export class Grid extends UI {
  public get __tag() {
    return 'Tool.Grid'
  }

  @dataProcessor(GridData)
  public declare __: IGridData

  public declare watchLeafer?: ILeafer

  @surfaceType(1)
  public declare lineStep: number

  @surfaceType(8)
  public declare minScale: number

  protected __eventIds: IEventListenerId[] = []

  constructor(data?: IGridInputData) {
    super(data)

    this.__bindEvent()

    console.log(this.toJSON())
  }

  private __bindEvent() {
    this.__eventIds = [this.getWatchLeafer().on_(RenderEvent.START, () => this.forceUpdate())]
  }
  private __unbindEvent() {
    this.getWatchLeafer().off_(this.__eventIds)
  }

  private getWatchLeafer() {
    return this.watchLeafer || this.leafer!
  }

  private getViewProt(): CurrentData {
    const watch = this.getWatchLeafer()

    const { a, d, e, f } = watch.getTransform()
    const { width, height } = watch

    return {
      scaleX: a,
      scaleY: d,
      offsetX: e,
      offsetY: f,
      width: width!,
      height: height!
    }
  }

  private drawLine(ctx: ICanvasContext2D, x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.closePath()
  }

  private drawHorizontalLines(ctx: ICanvasContext2D, data: CurrentData) {
    const { offsetX, scaleX, width, height } = data

    const realOffset = offsetX / scaleX

    let start = (realOffset - Math.floor(realOffset)) * scaleX
    const end = start + width!

    while (start <= end) {
      const x = start

      this.drawLine(ctx, x, 0, x, height)

      start += this.lineStep * scaleX
    }
  }

  private drawVerticalLines(ctx: ICanvasContext2D, data: CurrentData) {
    const { offsetY, scaleY, width, height } = data

    const realOffset = offsetY / scaleY

    let start = (realOffset - Math.floor(realOffset)) * scaleY
    const end = start + height

    while (start <= end) {
      const y = start

      this.drawLine(ctx, 0, y, width, y)

      start += this.lineStep * scaleY
    }
  }

  public __draw(canvas: ILeaferCanvas) {
    const data = this.getViewProt()

    if (data.scaleX <= this.minScale || data.scaleY <= this.minScale) return

    const ctx = canvas.context

    canvas.setStroke(this.stroke, this.__.__strokeWidth, this.__)

    this.drawHorizontalLines(ctx, data)
    this.drawVerticalLines(ctx, data)
  }

  public toJSON() {
    return Object.assign(super.toJSON(), { lineStep: this.lineStep, minScale: this.minScale })
  }

  public destroy(): void {
    this.watchLeafer = undefined

    this.__unbindEvent()
    super.destroy()
  }
}
