import { Grid } from './Grid'

import type { ComfyDesign } from '@comfy-design/core'

export interface GridConfig {
  enable: boolean
  gridPixelLineZoom: number
  gridPixelLineColor: string
}

export type ComfyDesignGridConfig = Partial<GridConfig> | true

const defaultGridConfig: GridConfig = {
  enable: true,
  gridPixelLineZoom: 8,
  gridPixelLineColor: '#cccccc22'
}

export class ComfyDesignGrid {
  static pluginName = 'grid'

  private config: GridConfig
  private grid: Grid

  constructor(private design: ComfyDesign) {
    this.config = this.design.config.setDefault('grid', defaultGridConfig)

    this.grid = new Grid({
      watchLeafer: this.design.Tree,
      stroke: this.config.gridPixelLineColor
    })

    this.design.Sky.add(this.grid, -1)
  }
}

declare module '@comfy-design/core' {
  interface CustomConfig {
    grid?: ComfyDesignGridConfig
  }
}
