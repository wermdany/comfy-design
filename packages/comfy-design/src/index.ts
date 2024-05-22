import { ComfyDesign } from '@comfy-design/core'
import { ComfyDesignEditor } from '@comfy-design/editor'
import { ComfyDesignSky } from '@comfy-design/sky'
import { ComfyDesignExport } from '@comfy-design/tree'

export { createComfyDesign } from '@comfy-design/core'
export type { CustomConfig, CustomApi } from '@comfy-design/core'

export { ComfyDesignEditor, ComfyDesignSky, ComfyDesignExport }

ComfyDesign.use(ComfyDesignEditor).use(ComfyDesignSky).use(ComfyDesignExport)
export default ComfyDesign
