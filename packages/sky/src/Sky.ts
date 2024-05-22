import { RenderEvent } from 'leafer-ui'
import { ComfyDesignEvent, withPluginsProxyProperty } from '@comfy-design/core'
import { Grid, Ruler, RulerDarkTheme, RulerLightTheme } from '@comfy-design/shapes'
import { mergeConfig } from '@comfy-design/shared'

import type { IEventListenerId } from '@leafer-ui/interface'
import type { ComfyDesign } from '@comfy-design/core'

import type { IRulerInputData, IGridInputData } from '@comfy-design/shapes'

export interface SkyConfig {
  grid?: Partial<IGridInputData>
  ruler?: Partial<IRulerInputData>
}

export type ComfyDesignSkyConfig = Partial<SkyConfig> | true

const defaultSkyConfig: SkyConfig = {
  grid: {
    visible: true,
    minScale: 8,
    lineStep: 1,
    stroke: '#cccccc22'
  },
  ruler: {
    visible: true,
    markLineSize: 2,
    gapSize: 3,
    fontSize: 10,
    marginSize: 3,
    outBorderSize: 1
  }
}

export class ComfyDesignSky {
  static pluginName = 'sky'

  private config: SkyConfig
  private grid: Grid
  private ruler: Ruler

  private __eventIds: IEventListenerId[] = []

  constructor(public design: ComfyDesign) {
    this.config = mergeConfig(defaultSkyConfig, design.config.sky)

    this.grid = new Grid(this.config.grid)
    this.ruler = new Ruler(this.config.ruler)

    this.design.Sky.add(this.grid, -2)
    this.design.Sky.add(this.ruler, 2)

    this.bindEvents()

    /**
     * proxy 'grid' 'ruler' to ComfyDesign
     */
    design.registerProxyProperties(
      ['grid', 'ruler'].map(key => withPluginsProxyProperty(ComfyDesignSky, key))
    )
  }

  private update() {
    this.grid.forceUpdate()
    this.ruler.forceUpdate()
  }

  private bindEvents() {
    const tree = this.design.Tree

    this.__eventIds = [tree.on_(RenderEvent.START, this.update, this)]

    this.design.on(ComfyDesignEvent.Theme, event => {
      if (event == 'light') {
        this.ruler.set(RulerLightTheme)
      } else {
        this.ruler.set(RulerDarkTheme)
      }
    })
  }

  private unbindEvents() {
    const tree = this.design.Tree

    tree.off_(this.__eventIds)
    this.__eventIds.length = 0
  }

  public destroy() {
    this.grid.destroy()
    this.ruler.destroy()

    this.unbindEvents()
  }
}

interface ComfyDesignSkyApi {
  /**
   * 比例尺实例
   * @proxy sky
   */
  ruler: Ruler
  /**
   * 网格实例
   * @proxy sky
   */
  grid: Grid
}

declare module '@comfy-design/core' {
  interface CustomConfig {
    sky?: ComfyDesignSkyConfig
  }

  interface CustomApi {
    sky: ComfyDesignSkyApi
  }
}
