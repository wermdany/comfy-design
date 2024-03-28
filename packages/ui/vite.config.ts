import { defineConfig } from 'vite'
import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  /**
   * 是否是内部模块
   */
  const isWatchAliasModule = mode === 'watch'

  const watchAlias = isWatchAliasModule
    ? [
        {
          find: /^@comfy-design\/(.*)/,
          replacement: resolve(__dirname, '../$1/src')
        },
        {
          find: 'comfy-design',
          replacement: resolve(__dirname, '../comfy-design/src')
        }
      ]
    : []

  const watchDefine = isWatchAliasModule ? { __DEV__: true } : {}

  return {
    plugins: [vue()],
    define: watchDefine,
    resolve: {
      alias: [
        ...watchAlias,
        {
          find: '@',
          replacement: resolve(__dirname, 'src')
        }
      ]
    },
    server: {
      host: true,
      port: 1100
    }
  }
})
