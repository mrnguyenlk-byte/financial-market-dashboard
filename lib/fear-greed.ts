/** Client-safe fear & greed helpers (no provider imports). */

export type FearGreedItem = {
  key: string
  value: number
}

export const fearGreedData: FearGreedItem[] = [
  { key: "fg.vnindex", value: 48 },
  { key: "fg.crypto", value: 71 },
  { key: "fg.usStocks", value: 58 },
]

export function fgLabel(value: number): string {
  if (value < 25) return "fg.extremeFear"
  if (value < 45) return "fg.fear"
  if (value < 55) return "fg.neutral"
  if (value < 75) return "fg.greed"
  return "fg.extremeGreed"
}
