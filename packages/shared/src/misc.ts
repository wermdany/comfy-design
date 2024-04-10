import { type AnyObject, isFun, isObject } from './is'

export function noop() {}

export function getProperty(target: Record<string, any>, key: string) {
  const keys = key.split('.')

  for (let i = 0; i < keys.length - 1; i++) {
    target = target[keys[i]]
    if (!isObject(target) || !target) return
  }

  const value = target[keys.pop()!]

  if (isFun(value)) {
    return value.bind(target)
  }

  return value
}

export function setProperty(target: Record<string, any>, key: string, value: any) {
  const keys = key.split('.')

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]

    if (!target[key]) target[key] = {}
    target = target[key]
  }

  target[keys.pop()!] = value
}

export function proxyProperty(target: Record<string, any>, sourceKey: string, key: string) {
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get: function proxyGetter() {
      return getProperty(this, sourceKey)
    },
    set: function proxySetter(value) {
      setProperty(this, sourceKey, value)
    }
  })
}

export function mergeConfig<T extends AnyObject>(a: T, b: unknown): T {
  const merged = Object.assign({}, a) as T

  if (!isObject(b)) return merged

  for (const key in b) {
    const value = b[key]

    if (isObject(value)) {
      merged[key as keyof T] = mergeConfig(merged[key], b[key])
    } else {
      merged[key as keyof T] = value
    }
  }

  return merged
}
