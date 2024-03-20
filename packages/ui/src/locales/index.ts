import { createI18n, type I18nOptions } from 'vue-i18n'

import type { App } from 'vue'

export const availableLocales = {
  zh_CN: '简体中文',
  en_US: 'English (US)'
}

export type AvailableLocales = keyof typeof availableLocales

export const defaultLocale: AvailableLocales = 'zh_CN'

export const fallbackLocale: AvailableLocales = 'zh_CN'

const vueI18nOptions: I18nOptions = {
  // 不使用传统的 api
  legacy: false,
  sync: true,
  // legacy 是否禁止失败时的警告 dev 开启
  silentTranslationWarn: true,
  // Composition API 本地化失败时是否禁止输出警告 dev 开启
  missingWarn: true,
  silentFallbackWarn: true,
  locale: defaultLocale,
  fallbackLocale: fallbackLocale,
  messages: {}
}

const vueI18n = createI18n(vueI18nOptions)

export function setupVueI18n(app: App) {
  app.use(vueI18n)
}
