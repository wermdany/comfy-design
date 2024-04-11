<script setup lang="ts">
import { computed, onMounted } from 'vue'
import ComfyDesign from 'comfy-design'
import { Rect } from 'leafer-ui'
import { Button } from 'ant-design-vue'

import { useSystemStore } from '@/store'

import EditerWorkspace from '@/views/workspace/EditerWorkspace/index.vue'
import WorkspaceToolbar from '@/views/workspace/EditerWorkspace/WorkspaceToolbar/index.vue'
import WorkspaceNav from '@/views/workspace/EditerWorkspace/WorkspaceNav/index.vue'
import WorkspacePanel from '@/views/workspace/EditerWorkspace/WorkspacePanel/index.vue'
import WorkspaceView from '@/views/workspace/EditerWorkspace/WorkspaceView/index.vue'

const design = ComfyDesign({ view: 'workspace-view', editor: true, sky: true })

const system = useSystemStore()

const Text = computed(() => (system.mode === 'dark' ? '切换为亮色' : '切换为暗色'))

const handleToggleThemeMode = () => {
  const mode = system.mode === 'dark' ? 'light' : 'dark'

  system.changeThemeMode(mode)
  design.changeTheme(mode)
}
const rect = new Rect({
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  fill: '#999',
  editable: true,
  editSize: 'size'
})

onMounted(() => {
  design.init()

  design.Tree.add(rect)

  console.log(design)
})

const handleDebugger = () => {}

defineOptions({
  name: 'Workspace'
})
</script>
<template>
  <EditerWorkspace>
    <WorkspaceToolbar>
      <Button @click="handleToggleThemeMode">{{ Text }}</Button>
      <Button @click="handleDebugger">Debugger</Button>
    </WorkspaceToolbar>
    <WorkspaceNav></WorkspaceNav>
    <WorkspacePanel></WorkspacePanel>
    <WorkspaceView></WorkspaceView>
  </EditerWorkspace>
</template>
