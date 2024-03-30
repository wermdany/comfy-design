export function renderPixel(any: number) {
  const left = Math.floor(any)
  const right = Math.ceil(any)
  return any - left < right - any ? left : right + 0.5
}
