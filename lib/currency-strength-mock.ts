import { strengthSeries } from "@/lib/market-utils"

/** Client-safe currency strength mock (no provider/cache imports). */

export type CurrencyStrengthMockItem = {
  code: string
  strength: number
  rankKey: string
  series: number[]
}

export type CurrencyStrengthChartMeta = {
  timezone: string
  timeLabels: string[]
}

export const currencyStrengthChartMeta: CurrencyStrengthChartMeta = {
  timezone: "UTC",
  timeLabels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
}

export const currencyStrengthItems: CurrencyStrengthMockItem[] = [
  { code: "USD", strength: 54.2, rankKey: "strength.strongest", series: strengthSeries(1) },
  { code: "VND", strength: 51.8, rankKey: "strength.veryStrong", series: strengthSeries(2) },
  { code: "EUR", strength: 48.6, rankKey: "strength.strong", series: strengthSeries(3) },
  { code: "JPY", strength: 46.2, rankKey: "strength.strong", series: strengthSeries(4) },
  { code: "GBP", strength: 44.1, rankKey: "strength.neutral", series: strengthSeries(5) },
  { code: "AUD", strength: 41.4, rankKey: "strength.weak", series: strengthSeries(6) },
  { code: "CHF", strength: 43.2, rankKey: "strength.neutral", series: strengthSeries(7) },
  { code: "CAD", strength: 39.8, rankKey: "strength.weak", series: strengthSeries(8) },
  { code: "NZD", strength: 36.2, rankKey: "strength.weakest", series: strengthSeries(9) },
]
