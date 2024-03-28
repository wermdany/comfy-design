import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/workspace/index.vue')
  },
  {
    path: '/setting',
    component: () => import('@/views/setting/index.vue')
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue')
  },
  {
    path: '/:_(.*)*',
    redirect: '/404'
  }
]

export default routes
