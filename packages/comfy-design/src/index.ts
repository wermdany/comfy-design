import { ComfyDesign } from '@comfy-design/core'
import { ComfyDesignRuler } from '@comfy-design/ruler'
import { ComfyDesignEditor } from '@comfy-design/editor'
import { ComfyDesignGrid } from '@comfy-design/grid'

export { createComfyDesign } from '@comfy-design/core'
export type { CustomConfig, CustomApi } from '@comfy-design/core'

export { ComfyDesignRuler, ComfyDesignEditor, ComfyDesignGrid }

ComfyDesign.use(ComfyDesignEditor).use(ComfyDesignRuler).use(ComfyDesignGrid)

export default ComfyDesign
