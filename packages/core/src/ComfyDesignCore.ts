import { App } from 'leafer-ui'
import { isFun, EventEmitter } from '@comfy-design/shared'

import type { ILeafer } from '@leafer-ui/interface'
import type { UnionToIntersection } from '@comfy-design/shared'

import { ComfyDesignConfigCtor } from './Config'
import { ComfyDesignProxy } from './Proxy'
import { logger } from './Util'

import type { DefConfig, Config } from './Config'
import type { ProxyImpApi, RegisterProxyPropertyItem } from './Proxy'
import type { Theme } from './Types'

export const enum PluginOrder {
  Pre = 'Pre',
  Post = 'Post'
}

const PluginOrderWeight = {
  [PluginOrder.Pre]: -1,
  [PluginOrder.Post]: 1
}

export interface DesignPlugin {
  pluginName: string
  order?: PluginOrder
  new (design: ComfyDesignCtor): any
}

export interface DesignPluginItem {
  name: string
  order?: PluginOrder.Pre | PluginOrder.Post
  ctor: DesignPlugin
}

export enum ComfyDesignEvent {
  Theme = 'Internal.Theme'
}

export interface ComfyDesignCtor extends ProxyImpApi {
  /**
   * 渲染层 - 结构层
   * @proxy core
   */
  Tree: ILeafer
  /**
   * 渲染层 - 天空层
   * @proxy core
   */
  Sky: ILeafer
  /**
   * 渲染层 - 背景层
   * @proxy core
   */
  Ground: ILeafer
}

export const defaultProxyProperty: RegisterProxyPropertyItem[] = [
  {
    key: 'registerProxyProperty',
    sourceKey: 'Proxy.registerProxyProperty'
  },
  {
    key: 'registerProxyProperties',
    sourceKey: 'Proxy.registerProxyProperties'
  },
  {
    key: 'Tree',
    sourceKey: 'LeaferApp.tree'
  },
  {
    key: 'Sky',
    sourceKey: 'LeaferApp.sky'
  },
  {
    key: 'Ground',
    sourceKey: 'LeaferApp.ground'
  }
]

export class ComfyDesignCtor<C = {}> extends EventEmitter {
  static plugins: DesignPluginItem[] = []

  static use(ctor: DesignPlugin) {
    const installed = ComfyDesignCtor.plugins.some(plugin => plugin.ctor === ctor)

    if (installed) {
      if (__DEV__) {
        logger.warn(`Plugin has already been registered.`)
      }

      return ComfyDesignCtor
    }

    ComfyDesignCtor.plugins.push({
      name: ctor.pluginName,
      order: ctor.order,
      ctor: ctor
    })

    return ComfyDesignCtor
  }

  private initialized = false
  private Proxy = new ComfyDesignProxy(defaultProxyProperty)

  public plugins: Record<string, any> = {}
  public config: ComfyDesignConfigCtor

  public LeaferApp!: App

  constructor(config?: C & Config) {
    super()

    this.plugins = {}
    this.config = new ComfyDesignConfigCtor().merge(config).process()

    return this.Proxy.enabled(this)
  }

  /************************************* Init ***********************************/

  public init() {
    if (this.initialized) return

    this.initLeaferApp()

    this.initPlugins()

    this.initialized = true
  }

  private initLeaferApp() {
    const app = new App({
      view: this.config.view,
      sky: { type: 'draw', usePartRender: false },
      tree: {
        wheel: { zoomSpeed: 0.1 },
        pointer: {
          // 更加精准的操作半径
          hitRadius: 0
        }
      },
      ground: { type: 'draw', usePartRender: false }
    })

    this.LeaferApp = app
  }

  private initPlugins() {
    const { config } = this

    ComfyDesignCtor.plugins
      .sort((a, b) => {
        const aOrder = a.order ? PluginOrderWeight[a.order] : 0
        const bOrder = b.order ? PluginOrderWeight[b.order] : 0
        return aOrder - bOrder
      })
      .forEach(plugin => {
        const ctor = plugin.ctor

        if (config[plugin.name] && isFun(ctor)) {
          this.plugins[plugin.name] = new ctor(this)
        }
      })
  }
  /************************************* Theme ***********************************/

  public changeTheme(mode: Theme) {
    const theme = this.config.theme

    if (mode !== theme) {
      this.config.theme = mode
      this.emit(ComfyDesignEvent.Theme, mode)
    }
  }

  /************************************* Destroy ***********************************/

  public destroy(): void {
    Object.keys(this.plugins).forEach(plugin => {
      const destroy = this.plugins[plugin].destroy
      if (destroy && isFun(destroy)) {
        destroy.call(this.plugins[plugin])
      }
    })

    super.destroy()
    this.LeaferApp.destroy()
    this.initialized = false
  }
}

export interface CustomApi {
  [key: string]: {}
}

type ExtractApi<C> = {
  [K in keyof C]: K extends string ? (DefConfig[K] extends undefined ? CustomApi[K] : never) : never
}[keyof C]

export function createComfyDesign<C = {}>(config: C & Config) {
  const design = new ComfyDesignCtor(config)

  return design as unknown as ComfyDesignCtor<C> & UnionToIntersection<ExtractApi<C>>
}

createComfyDesign.use = ComfyDesignCtor.use
createComfyDesign.plugins = ComfyDesignCtor.plugins

type CreateComfyDesign = typeof createComfyDesign

export interface BScrollFactory extends CreateComfyDesign {
  new <C = {}>(config?: Config & C): ComfyDesignCtor<C> & UnionToIntersection<ExtractApi<C>>
}

export type ComfyDesign<C = Config> = ComfyDesignCtor<C> & UnionToIntersection<ExtractApi<C>>

export const ComfyDesign = createComfyDesign as unknown as BScrollFactory
