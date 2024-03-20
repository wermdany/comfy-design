/**
 * 图片相关
 */

const URL = window.URL || window.webkitURL

/**
 * 加载一个图片
 * @param url
 */
export function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const element = document.createElement('img')

    element.crossOrigin = 'anonymous'

    element.onload = () => {
      resolve(element)
    }

    element.onerror = () => {
      resolve(null)
    }

    element.src = url
  })
}

/**
 * 创建 Blob 资源 URL
 * @param blob
 */
export function createBlobUrl(blob: Blob) {
  return URL.createObjectURL(blob)
}

/**
 * 释放 Blob URL 资源
 * @param url
 */
export function revokeBlobUrl(url: string) {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}
