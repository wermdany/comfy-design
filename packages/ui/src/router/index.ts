import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import routes from '@/router/routes'
import { createRouterGuard } from '@/router/guard'

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

export function setupVueRouter(app: App) {
  createRouterGuard(router)

  app.use(router)
}
