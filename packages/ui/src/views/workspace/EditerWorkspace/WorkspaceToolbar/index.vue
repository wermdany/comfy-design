<script setup lang="ts">
import { useAntdvCssVar } from 'use-antdv-css'

defineOptions({
  name: 'WorkspaceToolbar'
})

const css = useAntdvCssVar(token => ({
  width: '100%',
  height: token.editerToolbarHeight,
  position: 'absolute',
  top: 0,
  backgroundColor: token.colorFillQuaternary,
  boxShadow: `inset 0 -1px 0 ${token.editerColorBorder}`,
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${token.padding}`
}))
</script>
<template>
  <div :class="['workspace-toolbar', css]">
    <slot></slot>
  </div>
</template>
