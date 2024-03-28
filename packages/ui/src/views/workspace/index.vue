<script setup lang="ts">
import { onMounted } from 'vue'
import ComfyDesign from 'comfy-design'

import EditerWorkspace from '@/views/workspace/EditerWorkspace/index.vue'
import WorkspaceToolbar from '@/views/workspace/EditerWorkspace/WorkspaceToolbar/index.vue'
import WorkspaceNav from '@/views/workspace/EditerWorkspace/WorkspaceNav/index.vue'
import WorkspacePanel from '@/views/workspace/EditerWorkspace/WorkspacePanel/index.vue'
import WorkspaceView from '@/views/workspace/EditerWorkspace/WorkspaceView/index.vue'

const design = ComfyDesign({ view: 'workspace-view', ruler: true })

onMounted(() => {
  design.init()

  console.log(design)
})

defineOptions({
  name: 'Workspace'
})
</script>
<template>
  <EditerWorkspace>
    <WorkspaceToolbar></WorkspaceToolbar>
    <WorkspaceNav></WorkspaceNav>
    <WorkspacePanel></WorkspacePanel>
    <WorkspaceView></WorkspaceView>
  </EditerWorkspace>
</template>
