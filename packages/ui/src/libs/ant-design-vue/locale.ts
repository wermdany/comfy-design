import type { AvailableLocales } from '@/locales'
import type { Locale } from 'ant-design-vue/es/locale-provider'

import zh_CN from 'ant-design-vue/locale/zh_CN'
import en_US from 'ant-design-vue/locale/en_US'

/**
 * ant-design-vue 支持的国际化
 */
export const antDesignVueLocaleList: Record<AvailableLocales, Locale> = {
  zh_CN,
  en_US
}

export function useAntDesignVueLocale(lang: AvailableLocales) {
  return antDesignVueLocaleList[lang]
}
