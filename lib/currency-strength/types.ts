import type { Bi } from "@/lib/market-utils"

/** Currencies tracked by the strength engine. */
export const SUPPORTED_CURRENCIES = [
  "USD",
  "VND",
  "EUR",
  "JPY",
  "GBP",
  "AUD",
  "CHF",
  "CAD",
  "NZD",
] as const

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]

/** FX pairs used to derive cross-currency strength. */
export const STRENGTH_PAIRS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "AUDUSD",
  "USDCHF",
  "USDCAD",
  "NZDUSD",
  "USDVND",
] as const

export type StrengthPairSymbol = (typeof STRENGTH_PAIRS)[number]

export type PairLeg = {
  base: CurrencyCode
  quote: CurrencyCode
}

/** Static pair definitions — base/quote follows standard FX quoting. */
export const PAIR_LEGS: Record<StrengthPairSymbol, PairLeg> = {
  EURUSD: { base: "EUR", quote: "USD" },
  GBPUSD: { base: "GBP", quote: "USD" },
  USDJPY: { base: "USD", quote: "JPY" },
  AUDUSD: { base: "AUD", quote: "USD" },
  USDCHF: { base: "USD", quote: "CHF" },
  USDCAD: { base: "USD", quote: "CAD" },
  NZDUSD: { base: "NZD", quote: "USD" },
  USDVND: { base: "USD", quote: "VND" },
}

export type RawFxPairQuote = {
  symbol: string
  price: number
  changePercent: number
  updatedAt?: string
}

/** Normalized pair quote ready for strength calculation. */
export type FxPairQuote = {
  symbol: StrengthPairSymbol
  base: CurrencyCode
  quote: CurrencyCode
  price: number
  changePercent: number
  updatedAt: string
}

export type PairContribution = {
  symbol: StrengthPairSymbol
  delta: number
}

/** Per-currency output from the strength engine. */
export type CurrencyStrengthScore = {
  code: CurrencyCode
  name: Bi
  strength: number
  changePercent: number
  trend: "up" | "down" | "neutral"
  rankKey: string
  rank: number
  series: number[]
  contributions: PairContribution[]
  pairCount: number
}

export type CurrencyStrengthSnapshot = {
  currencies: CurrencyStrengthScore[]
  pairsUsed: StrengthPairSymbol[]
  calculatedAt: string
}

export const CURRENCY_NAMES: Record<CurrencyCode, Bi> = {
  USD: { vi: "Đô la Mỹ", en: "US Dollar" },
  VND: { vi: "Đồng Việt Nam", en: "Vietnamese Dong" },
  EUR: { vi: "Euro", en: "Euro" },
  JPY: { vi: "Yên Nhật", en: "Japanese Yen" },
  GBP: { vi: "Bảng Anh", en: "British Pound" },
  AUD: { vi: "Đô la Úc", en: "Australian Dollar" },
  CHF: { vi: "Franc Thụy Sĩ", en: "Swiss Franc" },
  CAD: { vi: "Đô la Canada", en: "Canadian Dollar" },
  NZD: { vi: "Đô la New Zealand", en: "New Zealand Dollar" },
}

/** Reference mock pair prices for offline / fallback calculation. */
export const REFERENCE_PAIR_QUOTES: Record<StrengthPairSymbol, { price: number; changePercent: number }> = {
  EURUSD: { price: 1.0852, changePercent: 0.19 },
  GBPUSD: { price: 1.2741, changePercent: 0.27 },
  USDJPY: { price: 157.21, changePercent: 0.22 },
  AUDUSD: { price: 0.6642, changePercent: -0.14 },
  USDCHF: { price: 0.8841, changePercent: -0.06 },
  USDCAD: { price: 1.3624, changePercent: 0.09 },
  NZDUSD: { price: 0.6128, changePercent: -0.21 },
  USDVND: { price: 25430, changePercent: 0.05 },
}
