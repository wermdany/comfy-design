import dayjs from 'dayjs'

import type { AvailableLocales } from '@/locales'

import zh_CN from 'dayjs/locale/zh_CN'
import en_US from 'dayjs/locale/en_US'

/**
 * dayjs 支持的国际化
 */
export const dayjsLocaleList: Record<AvailableLocales, any> = {
  zh_CN,
  en_US
}

/**
 * 应用 dayjs 国际化语言
 * @param lang
 */
export function useDayjsLocale(lang: AvailableLocales) {
  dayjs.locale(dayjsLocaleList[lang])
}
