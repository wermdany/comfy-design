export function getClosestValue(original: number, segment: number) {
  const n = Math.floor(original / segment)

  const left = segment * n
  const right = segment * (n + 1)
  return original - left <= right - original ? left : right
}
