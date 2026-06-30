/**
 * provide export image
 */

import { withPluginsProxyProperty } from '@comfy-design/core'
import { isBlob } from '@comfy-design/shared'

import type { IUI } from '@leafer-ui/interface'
import type { ComfyDesign } from '@comfy-design/core'

export function genExportFileName(base: string, config: ComfyDesignExportConfig) {
  const { prefix, suffix, type } = config

  const name = [base]

  if (prefix) name.unshift(prefix)
  if (suffix) name.push(suffix)
  name.push('.' + type)

  return name.join('')
}

export interface ComfyDesignExportConfig {
  type: 'png' | 'jpg' | 'webp'
  backgroundColor?: string
  pixelRatio?: number
  quality?: number
  prefix?: string
  suffix?: string
}

export class ComfyDesignExport {
  static pluginName = 'export'

  constructor(public design: ComfyDesign) {
    design.registerProxyProperty(withPluginsProxyProperty(ComfyDesignExport, 'export'))
  }

  public export(leaf: IUI, config: ComfyDesignExportConfig) {
    const { type } = config

    return new Promise<File | null>(resolve => {
      leaf
        .export(type, {
          blob: true,
          quality: config.quality,
          fill: config.backgroundColor,
          pixelRatio: config.pixelRatio
        })
        .then(result => {
          if (result.data && isBlob(result.data)) {
            return resolve(new File([result.data], genExportFileName(leaf.name!, config), result.data))
          }

          resolve(null)
        })
    })
  }
}

interface ComfyDesignExportApi {
  /**
   * 导出图片
   * @proxy Export
   */
  export: ComfyDesignExport['export']
}

declare module '@comfy-design/core' {
  interface CustomConfig {
    export?: true
  }

  interface CustomApi {
    export: ComfyDesignExportApi
  }
}
