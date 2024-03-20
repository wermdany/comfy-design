/**
 * 设置全局的 css 变量
 */

import { computed, watch } from 'vue'
import { theme } from 'ant-design-vue'
import { pick } from 'lodash-es'

const { useToken } = theme

const globalCssVarScope = '--css-var-scope-global-theme'

const getGlobalCssVarElement = () => {
  const element = document.querySelector('.' + globalCssVarScope) as HTMLStyleElement | null

  if (!element) {
    const style = document.createElement('style')

    style.className = globalCssVarScope

    document.head.appendChild(style)

    return style
  }

  return element
}

export function useGlobalCssVar() {
  const { token } = useToken()

  const useTokens = computed(() => {
    return pick(token.value, [
      'colorBgContainer',
      'fontSizeSM',
      'fontSize',
      'fontSizeLG',
      'fontSizeXL',
      'fontFamily',
      'colorText',
      'colorTextSecondary'
    ])
  })

  const useCssVar = () => {
    const element = getGlobalCssVarElement()

    const cssVar = useTokens.value

    const text = `:root {
      --color-bg-container: ${cssVar.colorBgContainer};
      --font-size-sm: ${cssVar.fontSizeSM}px;
      --font-size: ${cssVar.fontSize}px;
      --font-size-lg: ${cssVar.fontSizeLG}px;
      --font-size-xl: ${cssVar.fontSizeXL}px;
      --font-family: ${cssVar.fontFamily};
      --color-text: ${cssVar.colorText};
      --color-text-secondary: ${cssVar.colorTextSecondary};
    }`

    element.innerHTML = text
  }

  watch(
    token,
    () => {
      useCssVar()
    },
    {
      immediate: true
    }
  )
}
