<script setup lang="ts">
import { useAntdvCssVar } from 'use-antdv-css'

defineOptions({
  name: 'WorkspaceNav'
})

const css = useAntdvCssVar(token => ({
  width: token.editerNavWidth,
  position: 'absolute',
  top: token.editerToolbarHeight,
  left: 0,
  bottom: 0,
  backgroundColor: token.colorFillQuaternary,
  boxShadow: `inset -1px 0 0 ${token.editerColorBorder}`
}))
</script>
<template>
  <div :class="['workspace-nav', css]">
    <slot></slot>
  </div>
</template>
