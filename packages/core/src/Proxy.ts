import { getProperty, setProperty, type AnyObject, isUndef } from '@comfy-design/shared'
import { logger } from './Util'
import type { DesignPlugin } from './ComfyDesignCore'

export interface RegisterProxyPropertyItem {
  sourceKey: string
  key: string
}

export const defaultProxyProperty: RegisterProxyPropertyItem[] = [
  {
    key: 'registerProxyProperty',
    sourceKey: 'Proxy.registerProxyProperty'
  },
  {
    key: 'resisterProxyProperties',
    sourceKey: 'Proxy.resisterProxyProperties'
  }
]

export interface ProxyImpApi {
  registerProxyProperty: (property: RegisterProxyPropertyItem) => void
  registerProxyProperties: (properties: RegisterProxyPropertyItem[]) => void
}

export function withPluginsProxyProperty(plugin: DesignPlugin, property: string): RegisterProxyPropertyItem {
  const { pluginName } = plugin

  return {
    sourceKey: ['plugins', pluginName, property].join('.'),
    key: property
  }
}

export class ComfyDesignProxy implements ProxyImpApi {
  private proxyKeys: Record<string, string> = {}

  private original!: AnyObject

  constructor(property?: RegisterProxyPropertyItem[]) {
    if (property) {
      this.registerProxyProperties(property)
    }
  }

  public enabled<T extends AnyObject>(target: T): T {
    if (this.original) return this.original as T

    this.original = target

    const proxy = new Proxy(target, {
      get: (target, key: string) => {
        const value = target[key]

        return !isUndef(value) ? value : getProperty(target, this.proxyKeys[key])
      },
      set: (target, key: string, value) => {
        const proxyKey = this.proxyKeys[key]

        if (!proxyKey) {
          setProperty(target, key, value)
        }

        if (__DEV__ && proxyKey) {
          logger.warn(`Not allowed overwrite property: ${proxyKey}`)
        }

        return true
      }
    })

    return proxy
  }

  public registerProxyProperty(property: RegisterProxyPropertyItem) {
    const { key, sourceKey } = property

    if (__DEV__) {
      const proxyKey = this.proxyKeys[key]

      if (proxyKey) {
        logger.warn(`Repeated proxy property ${proxyKey} -> ${sourceKey}`)
      }
    }

    this.proxyKeys[key] = sourceKey
  }

  public registerProxyProperties(properties: RegisterProxyPropertyItem[]) {
    properties.forEach(property => this.registerProxyProperty(property))
  }
}
