import { UI, UIData, dataProcessor, registerUI, surfaceType } from 'leafer-ui'

import type { ICanvasContext2D, ILeafer, ILeaferCanvas, IUIData, IUIInputData } from '@leafer-ui/interface'

import type { ScreenViewPort } from './Types'

export interface IGridInputData extends IUIInputData {
  lineStep?: number
  minScale?: number
}

interface IGridData extends IUIData {}

class GridData extends UIData implements IGridData {}

@registerUI()
export class Grid extends UI {
  public get __tag() {
    return 'Toolkit.Grid'
  }

  @dataProcessor(GridData)
  public declare __: IGridData

  @surfaceType(1)
  public declare lineStep: number

  @surfaceType(8)
  public declare minScale: number

  public hittable = false

  constructor(
    public tree?: ILeafer,
    data?: IGridInputData
  ) {
    super(data)
  }

  private getViewProt(): ScreenViewPort {
    const { width, height } = this.tree!
    const { a, d, e, f } = this.tree!.getTransform()

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
    ctx.closePath()
    ctx.stroke()
  }

  private drawHorizontalLines(ctx: ICanvasContext2D, vp: ScreenViewPort) {
    const { offsetX, scaleX, width, height } = vp

    const realOffset = offsetX / scaleX

    let start = (realOffset - Math.floor(realOffset)) * scaleX
    const end = start + width!

    while (start <= end) {
      const x = start

      this.drawLine(ctx, x, 0, x, height)

      start += this.lineStep * scaleX
    }
  }

  private drawVerticalLines(ctx: ICanvasContext2D, vp: ScreenViewPort) {
    const { offsetY, scaleY, width, height } = vp

    const realOffset = offsetY / scaleY

    let start = (realOffset - Math.floor(realOffset)) * scaleY
    const end = start + height

    while (start <= end) {
      const y = start

      this.drawLine(ctx, 0, y, width, y)

      start += this.lineStep * scaleY
    }
  }

  public __updateBoxBounds(): void {
    const box = this.__layout.boxBounds

    box.x = 0
    box.y = 0

    box.width = this.leafer!.width!
    box.height = this.leafer!.height!
  }

  public __draw(canvas: ILeaferCanvas) {
    const vp = this.getViewProt()

    if (vp.scaleX <= this.minScale || vp.scaleY <= this.minScale) return

    const ctx = canvas.context

    canvas.setStroke(this.stroke, this.__.__strokeWidth, this.__)

    this.drawHorizontalLines(ctx, vp)
    this.drawVerticalLines(ctx, vp)
  }

  public toJSON() {
    const original = super.toJSON()

    return Object.assign(original, { lineStep: this.lineStep, minScale: this.minScale })
  }

  destroy(): void {
    this.tree = undefined
    super.destroy()
  }
}
