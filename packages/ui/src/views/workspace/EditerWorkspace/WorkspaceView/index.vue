<script setup lang="ts">
import { useAntdvCssVar } from 'use-antdv-css'

defineOptions({
  name: 'WorkspaceView'
})

const css = useAntdvCssVar(token => ({
  top: token.editerToolbarHeight,
  left: token.editerNavWidth,
  right: token.editerPanelWidth,
  bottom: 0,
  backgroundColor: token.colorFillTertiary
}))
</script>
<template>
  <div id="workspace-view" :class="css" style="position: absolute"></div>
</template>
