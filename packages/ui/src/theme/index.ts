import { defineComponent } from 'vue'

import { useGlobalCssVar } from '@/hooks'

export type ThemeMode = 'dark' | 'light'

export const ThemeProvider = defineComponent({
  name: 'ThemeProvider',
  setup(_, { slots }) {
    useGlobalCssVar()

    return slots.default
  }
})
