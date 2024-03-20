import type { Router } from 'vue-router'

import { createLaunchGuard } from './launchGuard'
import { createNavigationGuard } from './navigationGuard'

/**
 * 创建路由守卫
 * @param router
 */
export function createRouterGuard(router: Router) {
  createLaunchGuard(router)

  createNavigationGuard(router)
}
