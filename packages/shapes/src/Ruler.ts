import { UI, UIData, dataProcessor, registerUI, surfaceType } from 'leafer-ui'
import { getClosestValue } from '@comfy-design/shared'

import { transformContext, getLeaferLayer, getScreenViewPort } from './Utils'

import type { ICanvasContext2D, ILeaferCanvas, IUIData, IUIInputData } from '@leafer-ui/interface'

import type { ScreenViewPort } from './Types'

interface RulerRenderData {
  rulerSize: number
  markLineSize: number
  gapSize: number
  fontSize: number
  marginSize: number
  outBorderSize: number
}

export interface IRulerInputData extends IUIInputData {
  /** 刻度线大小 */
  markLineSize?: number
  /** 刻度线和文字缝隙大小*/
  gapSize?: number
  /** 文字大小 */
  fontSize?: number
  /** 文字具体边框的大小 */
  marginSize?: number
  /** 外边框大小 */
  outBorderSize?: number
}

interface IRulerData extends IUIData {}

class RulerData extends UIData implements IRulerData {}

export const RulerLightTheme: IRulerInputData = {
  gapSize: 3,
  fontSize: 10,
  markLineSize: 2,
  marginSize: 3,
  outBorderSize: 1,
  fill: '#f5f5f5',
  stroke: '#bbbbbb'
}

export const RulerDarkTheme: IRulerInputData = {
  gapSize: 3,
  fontSize: 10,
  markLineSize: 2,
  marginSize: 3,
  outBorderSize: 1,
  stroke: '#6f6f6f',
  fill: '#262626'
}

@registerUI()
export class Ruler extends UI {
  public get __tag() {
    return 'Ruler'
  }

  @dataProcessor(RulerData)
  public declare __: IRulerData

  @surfaceType(3)
  public declare gapSize: number

  @surfaceType(10)
  public declare fontSize: number

  @surfaceType(2)
  public declare markLineSize: number

  @surfaceType(3)
  public declare marginSize: number

  @surfaceType(1)
  public declare outBorderSize: number

  @surfaceType('#6f6f6f')
  public declare stroke: string

  @surfaceType('#262626')
  public declare fill: string

  public hittable = true

  private get rulerSize() {
    return this.marginSize + this.fontSize + this.gapSize + this.markLineSize + this.outBorderSize
  }

  constructor(data?: IRulerInputData) {
    super(data)
  }

  private getRulerData(): RulerRenderData {
    return {
      rulerSize: this.rulerSize,
      marginSize: this.marginSize,
      fontSize: this.fontSize,
      gapSize: this.gapSize,
      markLineSize: this.markLineSize,
      outBorderSize: this.outBorderSize
    }
  }

  private drawLine(ctx: ICanvasContext2D, x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.closePath()
    ctx.stroke()
  }

  public drawRulerBg(ctx: ICanvasContext2D, vp: ScreenViewPort, data: RulerRenderData) {
    const { width, height } = vp
    const { rulerSize } = data

    ctx.fillRect(0, 0, width, rulerSize)
    ctx.fillRect(0, 0, rulerSize, height)
  }

  private drawHorizontalRuler(ctx: ICanvasContext2D, vp: ScreenViewPort, data: RulerRenderData) {
    const { width, scaleX, offsetX } = vp
    const { rulerSize, marginSize, fontSize, gapSize } = data

    const step = getStepByZoom(scaleX)

    const realOffset = -offsetX / scaleX

    let startText = getClosestValue(realOffset, step)

    const offset = getClosestValue(realOffset, step) - realOffset

    let realStart = 0
    const realEnd = getClosestValue(width / scaleX - offset, step)

    const y = marginSize + fontSize

    while (realStart <= realEnd) {
      const x = (offset + realStart) * scaleX

      this.drawLine(ctx, x, y + gapSize, x, rulerSize)

      ctx.fillText(String(startText), x, y)

      realStart += step
      startText += step
    }
  }

  private drawVerticalRuler(ctx: ICanvasContext2D, vp: ScreenViewPort, data: RulerRenderData) {
    const { height, scaleY, offsetY } = vp
    const { rulerSize, marginSize, fontSize, gapSize } = data

    const step = getStepByZoom(scaleY)

    const realOffset = -offsetY / scaleY

    let startText = getClosestValue(realOffset, step)

    const offset = getClosestValue(realOffset, step) - realOffset

    let realStart = 0
    const realEnd = getClosestValue(height / scaleY - offset, step)

    const x = marginSize + fontSize

    while (realStart <= realEnd) {
      const y = (offset + realStart) * scaleY

      this.drawLine(ctx, x + gapSize, y, rulerSize, y)

      transformContext(ctx, -Math.PI / 2, x, y)
      ctx.fillText(String(startText), x, y)
      transformContext(ctx, Math.PI / 2, x, y)

      startText += step
      realStart += step
    }
  }

  public __updateBoxBounds(): void {
    const box = this.__layout.boxBounds

    box.x = 0
    box.y = 0

    box.width = this.leafer!.width!
    box.height = this.leafer!.height!
  }

  public __drawHitPath(hitCanvas: ILeaferCanvas): void {
    const { context } = hitCanvas
    const { x, y, width, height } = this.__layout.boxBounds

    context.beginPath()
    context.rect(x, y, this.rulerSize, height)
    context.rect(x, y, width, this.rulerSize)
    context.closePath()
  }

  public __draw(canvas: ILeaferCanvas) {
    const tree = getLeaferLayer(this, 'tree')
    if (!tree) return

    const ctx = canvas.context

    const vp = getScreenViewPort(tree)

    const data = this.getRulerData()

    canvas.setStroke(this.stroke, this.__.__strokeWidth, this.__)
    canvas.fillStyle = this.fill

    this.drawRulerBg(ctx, vp, data)

    canvas.textAlign = 'center'
    canvas.fillStyle = this.stroke
    canvas.font = `${data.fontSize}px sans-serif`

    this.drawHorizontalRuler(ctx, vp, data)
    this.drawVerticalRuler(ctx, vp, data)

    canvas.strokeWidth = data.outBorderSize
    canvas.fillStyle = this.fill

    ctx.fillRect(0, 0, data.rulerSize, data.rulerSize)

    this.drawLine(ctx, 0, data.rulerSize, vp.width, data.rulerSize)
    this.drawLine(ctx, data.rulerSize, 0, data.rulerSize, vp.height)
  }

  public toJSON() {
    const original = super.toJSON()

    return Object.assign(original, {
      markLineSize: this.markLineSize,
      gapSize: this.gapSize,
      fontSize: this.fontSize,
      marginSize: this.marginSize,
      outBorderSize: this.outBorderSize
    })
  }

  public destroy(): void {
    super.destroy()
  }
}

const steps = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2000, 5000]

export function getStepByZoom(zoom: number) {
  const step = 50 / zoom

  for (let i = 0, len = steps.length; i < len; i++) {
    if (steps[i] >= step) return steps[i]
  }
  return steps[0]
}
