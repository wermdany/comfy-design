import { type Router, START_LOCATION } from 'vue-router'

/**
 * 创建应用路由启动器
 * @param router
 */
export function createLaunchGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    // 页面首次加载
    if (from === START_LOCATION) {
      import.meta.env.DEV && console.log('onLaunch')
    }

    return next()
  })
}
