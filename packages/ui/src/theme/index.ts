import { defineComponent, reactive, watch } from 'vue'
import { useGlobalCssVar } from 'use-antdv-css'

import { useSystemStore } from '@/store'

export interface GlobalCssVar {
  editerToolbarHeight: string
  editerNavWidth: string
  editerPanelWidth: string
  editerColorBorder: string
}

declare module 'use-antdv-css' {
  export interface CustomCssVar extends GlobalCssVar {}
}

export type ThemeMode = 'dark' | 'light'

const getGlobalCssVar = (mode: ThemeMode): GlobalCssVar => ({
  editerToolbarHeight: '48px',
  editerNavWidth: '240px',
  editerPanelWidth: '252px',
  editerColorBorder: mode === 'dark' ? '#080808' : '#efefef'
})

export const ThemeProvider = defineComponent({
  name: 'ThemeProvider',
  setup(_, { slots }) {
    const system = useSystemStore()

    const globalCssVar = reactive<GlobalCssVar>(getGlobalCssVar(system.mode))

    useGlobalCssVar(globalCssVar)

    watch(
      () => system.mode,
      mode => {
        Object.assign(globalCssVar, getGlobalCssVar(mode))
      }
    )

    return slots.default
  }
})
