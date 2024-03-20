<script setup lang="ts">
import { Button } from 'ant-design-vue'

import { useSystemStore } from '@/store'

const system = useSystemStore()

const handleChangeThemeMode = () => {
  if (system.mode == 'dark') {
    system.changeThemeMode('light')
  } else {
    system.changeThemeMode('dark')
  }
}
</script>
<template>
  <Button @click="handleChangeThemeMode">123</Button>
  <p>哈哈</p>
</template>
@/store
