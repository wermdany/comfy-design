export type AnyFun = (...args: any[]) => any

export type AnyObject = Record<string, any>

export function isUndef(unk: unknown) {
  return unk === undefined
}

export function isFun(unk: unknown): unk is AnyFun {
  return typeof unk === 'function'
}

export function isObject(unk: unknown): unk is AnyObject {
  return typeof unk === 'object' && unk !== null
}

export function isArray(unk: unknown): unk is any[] {
  return Array.isArray(unk)
}

export function isStr(unk: unknown): unk is string {
  return typeof unk === 'string'
}
