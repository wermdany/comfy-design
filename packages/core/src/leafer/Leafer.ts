import { App as LeaferApp } from 'leafer-ui'

import type { IAppConfig } from '@leafer-ui/interface'

export interface LeaferConstructorOptions extends IAppConfig {}

export const DefaultLeaferConstructorOptions: LeaferConstructorOptions = {}

export class LeaferConstructor {
  private options: LeaferConstructorOptions

  private LeaferApp: LeaferApp

  constructor(options: LeaferConstructorOptions) {
    this.options = options

    this.LeaferApp = new LeaferApp(this.options)
  }
}
