import { withPluginsProxyProperty } from '@comfy-design/core'

import type { ComfyDesign } from '@comfy-design/core'
import type { ICanvasContext2D, ILeafer } from '@leafer-ui/interface'

declare module '@comfy-design/core' {
  interface CustomConfig {
    ruler?: ComfyDesignRulerConfig
  }

  interface CustomApi {
    ruler: ComfyDesignRulerApi
  }
}

interface ThemeColor {
  bgColor: string
  textColor: string
  borderColor: string
  lineColor: string
  fontSize: number
}

interface ComfyDesignRulerApi {
  rulerEnable: (enable: boolean) => void
}

export interface RulerConfig {
  dark: ThemeColor
  light: ThemeColor
  enable: boolean
}

export type ComfyDesignRulerConfig = Partial<RulerConfig> | true

export class Ruler {
  static pluginName = 'Ruler'

  private Ruler: ILeafer
  private ctx: ICanvasContext2D

  private theme: ThemeColor
  private enabled: boolean = true

  constructor(private design: ComfyDesign) {
    const app = design.LeaferApp
    this.Ruler = app.addLeafer()
    this.ctx = this.Ruler.canvas.context

    this.design.registerProxyProperty(withPluginsProxyProperty(Ruler, this.rulerEnable.name))
  }

  private render() {
    const theme = this.design.config.theme
  }

  private rulerEnable(enable: boolean) {
    console.log(enable, this)
  }

  private drawLine() {}
}
