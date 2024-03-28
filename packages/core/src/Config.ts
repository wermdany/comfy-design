import { logger } from './Util'

import type { Theme } from './Types'

export interface CustomConfig {}

export interface DefConfig {
  [key: string]: any
  view: string
  theme?: Theme
}

export interface Config extends DefConfig, CustomConfig {}

export class CustomConfig {}

export class ComfyDesignConfigCtor extends CustomConfig implements DefConfig {
  [key: string]: any

  public view: string = ''
  public theme: Theme = 'dark'

  constructor() {
    super()
  }

  public merge(config?: Partial<Config>) {
    if (!config) return this

    for (const key in config) {
      this[key] = config[key]
    }

    return this
  }

  public process() {
    if (!this.view) {
      logger.error('You must set the mount node')
    }

    return this
  }
}
