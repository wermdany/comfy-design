import { withPluginsProxyProperty } from '@comfy-design/core'

import type { ComfyDesign } from '@comfy-design/core'
import type { ICanvasContext2D, ILeafer } from '@leafer-ui/interface'

interface ThemeColor {
  bgColor: string
  textColor: string
  borderColor: string
  lineColor: string
  fontSize: number
}

interface ComfyDesignRulerApi {
  /**
   * @proxy
   */
  rulerEnable: (enable: boolean) => void
}

export interface RulerConfig {
  dark: ThemeColor
  light: ThemeColor
  enable: boolean
}

export class ComfyDesignRuler {
  static pluginName = 'ruler'

  private ctx: ICanvasContext2D

  private theme: ThemeColor
  private enabled: boolean = true

  constructor(private design: ComfyDesign) {
    this.ctx = this.design.Sky.canvas.context

    this.design.registerProxyProperty(withPluginsProxyProperty(ComfyDesignRuler, this.rulerEnable.name))
  }

  private render() {
    const theme = this.design.config.theme
  }

  private rulerEnable(enable: boolean) {
    console.log(enable, this)
  }

  private drawLine() {}
}

export type ComfyDesignRulerConfig = Partial<RulerConfig> | true

declare module '@comfy-design/core' {
  interface CustomConfig {
    ruler?: ComfyDesignRulerConfig
  }

  interface CustomApi {
    ruler: ComfyDesignRulerApi
  }
}
