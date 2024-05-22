export type IFun = (...args: any[]) => any

export type IObject = Record<string, any>

const toString = Object.prototype.toString

export const getType = (obj: any) => toString.call(obj)

export const isType =
  <T>(type: string | string[]) =>
  (obj: unknown): obj is T =>
    getType(obj) === `[object ${type}]`

export function isUndef(unk: unknown) {
  return unk === undefined
}

export function isFun(unk: unknown): unk is IFun {
  return typeof unk === 'function'
}

export const isPlainObj = isType<object>('Object')

export const isBlob = isType<Blob>('Blob')

export function isObject(unk: unknown): unk is IObject {
  return typeof unk === 'object' && unk !== null
}

export const isArray = Array.isArray

export function isStr(unk: unknown): unk is string {
  return typeof unk === 'string'
}
