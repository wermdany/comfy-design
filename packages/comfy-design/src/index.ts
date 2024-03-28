import { ComfyDesign } from '@comfy-design/core'
import { Ruler } from '@comfy-design/ruler'

export { createComfyDesign } from '@comfy-design/core'
export type { CustomConfig, CustomApi } from '@comfy-design/core'

export { Ruler }

ComfyDesign.use(Ruler)

export default ComfyDesign
