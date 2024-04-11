import { Logger } from '@comfy-design/shared'

import type { ICanvasContext2D, ILeafer } from '@leafer-ui/interface'
import type { UI } from 'leafer-ui'

import type { ScreenViewPort } from './Types'

export const logger = new Logger('Shapes')

export type LeaferLayer = 'sky' | 'tree' | 'ground'

export function getScreenViewPort(leafer: ILeafer): ScreenViewPort {
  const { a, d, e, f } = leafer.getTransform()
  const { width, height } = leafer

  return {
    scaleX: a,
    scaleY: d,
    offsetX: e,
    offsetY: f,
    width: width!,
    height: height!
  }
}

export function getLeaferLayer(shape: UI, layer: LeaferLayer): ILeafer | undefined {
  try {
    return shape.leafer!.app[layer]
  } catch (error) {
    __DEV__ && logger.warn(`No found render layer ${layer}, ${shape.tag} must run on leafer app.`)
  }
}

export function transformContext(ctx: ICanvasContext2D, angle: number, x: number, y: number) {
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.translate(-x, -y)
}
