<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ConfigProvider } from 'ant-design-vue'

import { useSystemStore } from '@/store'
import { ThemeProvider } from '@/theme'

const { locale, theme } = storeToRefs(useSystemStore())
</script>
<template>
  <ConfigProvider :theme="theme" :locale="locale">
    <ThemeProvider>
      <router-view></router-view>
    </ThemeProvider>
  </ConfigProvider>
</template>
