import type { Router } from 'vue-router'

/**
 * 创建应用路由导航
 * @param router
 */
export function createNavigationGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    next()
  })
}
