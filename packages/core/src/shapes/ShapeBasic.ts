export interface ShapeBasicConfig {
  [key: string]: any

  x: number
  y: number
  width: number
  height: number

  visible: boolean
  /** 0-100 */
  opacity: number

  scaleX: number
  scaleY: number
  offsetX: number
  offsetY: number

  id: string
  name: string

  lock: boolean
}

export abstract class ShapeBasic<Config extends ShapeBasicConfig = ShapeBasicConfig> {
  constructor() {}

  /**
   * 绘制图形的轮廓
   */
  public drawOutline() {}

  /**
   * 序列化为对象
   */
  public toObject() {}
}
