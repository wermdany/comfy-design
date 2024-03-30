import { createApp } from 'vue'

import router, { setupVueRouter } from '@/router'
import { setupVueStore } from '@/store'
import { setupVueI18n } from '@/locales'

import '@/styles/theme.css'

import App from '@/App.vue'

const app = createApp(App)

;(async () => {
  setupVueI18n(app)
  setupVueStore(app)

  setupVueRouter(app)

  await router.isReady()

  app.mount('#comfy-design')
})()
