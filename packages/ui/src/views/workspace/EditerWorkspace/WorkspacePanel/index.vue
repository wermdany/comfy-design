<script setup lang="ts">
import { useAntdvCssVar } from 'use-antdv-css'

defineOptions({
  name: 'WorkspacePanel'
})

const css = useAntdvCssVar(token => ({
  width: token.editerPanelWidth,
  position: 'absolute',
  top: token.editerToolbarHeight,
  right: 0,
  bottom: 0,
  backgroundColor: token.colorFillQuaternary,
  boxShadow: `inset 1px 0 0 ${token.editerColorBorder}`
}))
</script>
<template>
  <div :class="['workspace-panel', css]">
    <slot></slot>
  </div>
</template>
