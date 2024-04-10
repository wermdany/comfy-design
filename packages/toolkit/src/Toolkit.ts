import { RenderEvent } from 'leafer-ui'
import { ComfyDesignEvent, withPluginsProxyProperty } from '@comfy-design/core'
import { mergeConfig } from '@comfy-design/shared'

import { Grid } from './Grid'
import { Ruler, RulerLightTheme, RulerDarkTheme } from './Ruler'

import type { IEventListenerId } from '@leafer-ui/interface'
import type { ComfyDesign } from '@comfy-design/core'

import type { IGridInputData } from './Grid'
import type { IRulerInputData } from './Ruler'

export interface ToolkitConfig {
  grid?: Partial<IGridInputData>
  ruler?: Partial<IRulerInputData>
}

export type ComfyDesignToolkitConfig = Partial<ToolkitConfig> | true

const defaultToolkitConfig: ToolkitConfig = {
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

export class ComfyDesignToolkit {
  static pluginName = 'toolkit'

  private config: ToolkitConfig
  private grid: Grid
  private ruler: Ruler

  private __eventIds: IEventListenerId[] = []

  constructor(public design: ComfyDesign) {
    this.config = mergeConfig(defaultToolkitConfig, design.config.toolkit)

    const tree = this.design.Tree

    this.grid = new Grid(tree, this.config.grid)
    this.ruler = new Ruler(tree, this.config.ruler)

    this.design.Sky.add(this.grid, -2)
    this.design.Sky.add(this.ruler, 2)

    this.bindEvents()

    design.registerProxyProperty(withPluginsProxyProperty(ComfyDesignToolkit))
  }

  public update() {
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

interface ComfyDesignToolkitApi {
  /**
   * @proxy toolkit
   */
  toolkit: ComfyDesignToolkit
}

declare module '@comfy-design/core' {
  interface CustomConfig {
    toolkit?: ComfyDesignToolkitConfig
  }

  interface CustomApi {
    toolkit: ComfyDesignToolkitApi
  }
}
