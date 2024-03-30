import { defineStore } from 'pinia'

import { useAntDesignVueLocale, useAntDesignVueTheme } from '@/libs/ant-design-vue'

import type { AvailableLocales } from '@/locales'
import type { ThemeMode } from '@/theme'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'

interface SystemStoreState {
  lang: AvailableLocales
  mode: ThemeMode
}

export const useSystemStore = defineStore('SystemStore', {
  state: (): SystemStoreState => ({
    lang: 'zh_CN',
    mode: 'dark'
  }),
  getters: {
    locale: state => useAntDesignVueLocale(state.lang),
    theme: (state): ThemeConfig => ({
      algorithm: useAntDesignVueTheme(state.mode)
    })
  },
  actions: {
    changeThemeMode(mode: ThemeMode) {
      this.mode = mode
    }
  }
})
