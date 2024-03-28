<script setup lang="ts">
import { useAntdvCssVar } from 'use-antdv-css'

defineOptions({
  name: 'EditerWorkspace'
})

const css = useAntdvCssVar(token => ({
  minWidth: `calc(${token.editerNavWidth} + ${token.editerPanelWidth} + 1px) `,
  height: '100vh',
  position: 'relative',
  backgroundColor: token.colorBgContainer
}))
</script>
<template>
  <div :class="['editer-workspace', css]">
    <slot></slot>
  </div>
</template>
