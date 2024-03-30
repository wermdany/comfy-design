import { logger } from './Util'

import { type DropTypes, merge } from '@comfy-design/shared'
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

  public setDefault<T extends keyof CustomConfig>(
    scope: T,
    def: DropTypes<NonNullable<CustomConfig[T]>, boolean>
  ) {
    const input = this[scope] as NonNullable<CustomConfig[T]>

    this[scope] = merge(def, input)

    return this[scope] as Required<DropTypes<NonNullable<CustomConfig[T]>, boolean>>
  }

  public getDefault<T extends keyof CustomConfig>(scope: T) {
    if (scope in this) {
      return this[scope] as CustomConfig[T]
    }
  }
}
