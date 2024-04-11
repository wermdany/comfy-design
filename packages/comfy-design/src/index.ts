import { ComfyDesign } from '@comfy-design/core'
import { ComfyDesignEditor } from '@comfy-design/editor'
import { ComfyDesignSky } from '@comfy-design/sky'

export { createComfyDesign } from '@comfy-design/core'
export type { CustomConfig, CustomApi } from '@comfy-design/core'

export { ComfyDesignEditor, ComfyDesignSky }

ComfyDesign.use(ComfyDesignEditor).use(ComfyDesignSky)

export default ComfyDesign
