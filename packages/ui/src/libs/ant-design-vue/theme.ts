import { theme } from 'ant-design-vue'

import type { DerivativeFunc } from 'ant-design-vue'
import type { SeedToken } from 'ant-design-vue/es/theme/internal'
import type { MapToken } from 'ant-design-vue/es/theme/interface'

import type { ThemeMode } from '@/theme'

export type ThemeAlgorithm = DerivativeFunc<SeedToken, MapToken>

const themeMap: Record<ThemeMode, ThemeAlgorithm> = {
  dark: theme.darkAlgorithm,
  light: theme.defaultAlgorithm
}

export function useAntDesignVueTheme(mode: ThemeMode) {
  return themeMap[mode]
}
