import { createPinia } from 'pinia'
import type { App } from 'vue'

const store = createPinia()

export default store

export function setupVueStore(app: App) {
  app.use(store)
}

export * from '@/store/models/system'
