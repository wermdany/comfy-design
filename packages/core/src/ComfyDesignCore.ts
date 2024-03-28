import { App } from 'leafer-ui'
import { isFun, EventEmitter } from '@comfy-design/shared'

import { Rect } from 'leafer-ui'

import type { ILeafer } from '@leafer-ui/interface'
import type { UnionToIntersection } from '@comfy-design/shared'

import { ComfyDesignConfigCtor } from './Config'
import { ComfyDesignProxy, defaultProxyProperty } from './Proxy'
import { ComfyDesignEditor } from './Editor'
import { logger } from './Util'

import type { DefConfig, Config } from './Config'
import type { ProxyImpApi } from './Proxy'
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

export interface ComfyDesignCtor extends ProxyImpApi {}

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
  private Editor = new ComfyDesignEditor(this)

  public plugins: Record<string, any> = {}
  public config: ComfyDesignConfigCtor

  public LeaferApp!: App
  public Tree!: ILeafer

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

    this.Editor.initEditor()

    this.initPlugins()

    this.initialized = true
  }

  private initLeaferApp() {
    const app = new App({
      view: this.config.view,
      sky: { type: 'draw', usePartRender: false },
      tree: {},
      ground: { type: 'draw', usePartRender: false }
    })

    const rect = new Rect({
      x: 25,
      y: 25,
      width: 100,
      height: 100,
      fill: '#999',
      editable: true,
      editSize: 'size',
      cornerRadius: 30
    })

    app.tree.add(rect)
    app.tree.add(
      new Rect({
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        fill: '#999',
        editable: true,
        editSize: 'size',
        cornerRadius: 30
      })
    )

    this.LeaferApp = app
    this.Tree = app.tree
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
