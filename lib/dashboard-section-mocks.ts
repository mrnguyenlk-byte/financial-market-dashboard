/** Client-safe dashboard section mock data (no provider imports). */

import type { Bi, Trend } from "@/lib/market-utils"

export type CurrencyPair = {
  pair: string
  price: number
  changePercent: number
  weekChangePercent: number
  monthChangePercent: number
  trend: Trend
  seed: number
}

export const currencyPerformance: CurrencyPair[] = [
  { pair: "EUR/USD", price: 1.0852, changePercent: 0.19, weekChangePercent: 0.62, monthChangePercent: -0.84, trend: "up", seed: 4 },
  { pair: "GBP/USD", price: 1.2741, changePercent: 0.27, weekChangePercent: 0.41, monthChangePercent: 1.12, trend: "up", seed: 6 },
  { pair: "USD/JPY", price: 157.21, changePercent: 0.22, weekChangePercent: -0.33, monthChangePercent: 2.05, trend: "up", seed: 8 },
  { pair: "USD/VND", price: 25430, changePercent: 0.05, weekChangePercent: 0.18, monthChangePercent: 0.74, trend: "up", seed: 11 },
  { pair: "AUD/USD", price: 0.6642, changePercent: -0.14, weekChangePercent: -0.52, monthChangePercent: 0.31, trend: "down", seed: 13 },
  { pair: "USD/CHF", price: 0.8974, changePercent: 0.08, weekChangePercent: 0.22, monthChangePercent: -0.66, trend: "up", seed: 16 },
]

export type MarketBreadth = {
  market: Bi
  advancing: number
  declining: number
  unchanged: number
  newHighs: number
  newLows: number
  aboveMa: number
}

export const marketBreadthData: MarketBreadth[] = [
  { market: { vi: "NYSE", en: "NYSE" }, advancing: 1842, declining: 1106, unchanged: 124, newHighs: 96, newLows: 31, aboveMa: 64 },
  { market: { vi: "Nasdaq", en: "Nasdaq" }, advancing: 2104, declining: 1588, unchanged: 210, newHighs: 142, newLows: 58, aboveMa: 57 },
  { market: { vi: "HOSE", en: "HOSE" }, advancing: 168, declining: 214, unchanged: 62, newHighs: 14, newLows: 9, aboveMa: 48 },
]

export type TopMover = {
  symbol: string
  name: Bi
  price: number
  changePercent: number
  trend: Trend
}

export type TopMoversData = {
  gainers: TopMover[]
  losers: TopMover[]
}

export const topMovers: TopMoversData = {
  gainers: [
    { symbol: "TON", name: { vi: "Toncoin", en: "Toncoin" }, price: 7.42, changePercent: 5.21, trend: "up" },
    { symbol: "SOL", name: { vi: "Solana", en: "Solana" }, price: 148.6, changePercent: 4.62, trend: "up" },
    { symbol: "NVDA", name: { vi: "NVIDIA", en: "NVIDIA" }, price: 131.8, changePercent: 3.41, trend: "up" },
    { symbol: "AVAX", name: { vi: "Avalanche", en: "Avalanche" }, price: 36.2, changePercent: 3.11, trend: "up" },
    { symbol: "FPT", name: { vi: "FPT", en: "FPT" }, price: 134.5, changePercent: 2.18, trend: "up" },
  ],
  losers: [
    { symbol: "TSLA", name: { vi: "Tesla", en: "Tesla" }, price: 178.2, changePercent: -2.34, trend: "down" },
    { symbol: "DOGE", name: { vi: "Dogecoin", en: "Dogecoin" }, price: 0.158, changePercent: -2.05, trend: "down" },
    { symbol: "DOT", name: { vi: "Polkadot", en: "Polkadot" }, price: 6.18, changePercent: -1.62, trend: "down" },
    { symbol: "HPG", name: { vi: "Hòa Phát", en: "Hoa Phat" }, price: 28.4, changePercent: -1.45, trend: "down" },
    { symbol: "ETH", name: { vi: "Ethereum", en: "Ethereum" }, price: 3548, changePercent: -1.17, trend: "down" },
  ],
}
