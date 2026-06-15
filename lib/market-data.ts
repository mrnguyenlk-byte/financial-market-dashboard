// Centralized mock data for BTrading Market Insights.
// Illustrative placeholder values only — not real-time prices.
// Replace provider getData() implementations with API responses when wiring live data.

export type { Bi, Trend } from "@/lib/market-utils"
export { toTrend, spark, strengthSeries } from "@/lib/market-utils"

import { getData as getMarketProviderData } from "@/lib/providers/market-provider"
import {
  marketOverview,
  marketTickers,
  sidebarOverview,
} from "@/lib/providers/market-provider"
import { getData as getHeatmapProviderData } from "@/lib/providers/heatmap-provider"
import { getData as getCurrencyProviderData } from "@/lib/providers/currency-provider"
import { getMockData as getCalendarMockData } from "@/lib/providers/calendar-provider"
import { getMockData as getNewsMockData } from "@/lib/providers/news-provider"

// Re-export provider types
export type {
  TickerBarItem,
  MarketTicker,
  SidebarOverviewItem,
  OverviewCategory,
  OverviewListItem,
  MarketAsset,
} from "@/lib/providers/market-provider"

export type {
  HeatmapTile,
  HeatmapMarketId,
  VnExchangeId,
  HeatmapExchange,
  HeatmapMarket,
} from "@/lib/providers/heatmap-provider"

export type {
  CurrencyStrengthItem,
  CurrencyStrengthChartMeta,
} from "@/lib/providers/currency-provider"

export type { EconomicEvent } from "@/lib/providers/economic-provider"
export type { MarketNewsItem } from "@/lib/providers/news-provider"

// Provider-backed data (backward-compatible named exports)
const _market = getMarketProviderData()
export const tickerBarItems = _market.tickerBarItems
export const dashboardTickerBarItems = _market.dashboardTickerBarItems
export const overviewByCategory = _market.overviewByCategory

export { sidebarOverview, marketTickers, marketOverview }

const _heatmap = getHeatmapProviderData()
export const heatmapMarkets = _heatmap.markets

const _currency = getCurrencyProviderData()
export const currencyStrength = _currency.items
export const currencyStrengthChartMeta = _currency.chartMeta
/** @deprecated Use currencyStrengthChartMeta.timeLabels */
export const currencyStrengthTimeLabels = currencyStrengthChartMeta.timeLabels

const _calendar = getCalendarMockData()
export const economicEvents = _calendar.events

const _news = getNewsMockData()
export const marketNews = _news.items

// ---------------------------------------------------------------------------
// Currency performance (legacy — not yet moved to provider)
// ---------------------------------------------------------------------------

import type { Trend } from "@/lib/market-utils"

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

export {
  fearGreedData,
  fgLabel,
  type FearGreedItem,
} from "@/lib/fear-greed"

// ---------------------------------------------------------------------------
// Market breadth
// ---------------------------------------------------------------------------

export type MarketBreadth = {
  market: import("@/lib/market-utils").Bi
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

// ---------------------------------------------------------------------------
// Top movers
// ---------------------------------------------------------------------------

export type TopMover = {
  symbol: string
  name: import("@/lib/market-utils").Bi
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

// ---------------------------------------------------------------------------
// Watchlist
// ---------------------------------------------------------------------------

export type WatchlistItem = {
  symbol: string
  name: import("@/lib/market-utils").Bi
  price: number
  changePercent: number
  trend: Trend
  seed: number
}

export const watchlistItems: WatchlistItem[] = [
  { symbol: "AAPL", name: { vi: "Apple", en: "Apple" }, price: 214.3, changePercent: 1.24, trend: "up", seed: 2 },
  { symbol: "BTC", name: { vi: "Bitcoin", en: "Bitcoin" }, price: 68240, changePercent: 2.12, trend: "up", seed: 5 },
  { symbol: "GOLD", name: { vi: "Vàng", en: "Gold" }, price: 2347.8, changePercent: 0.53, trend: "up", seed: 8 },
  { symbol: "VNINDEX", name: { vi: "VN-Index", en: "VN-Index" }, price: 1281.4, changePercent: -0.53, trend: "down", seed: 11 },
  { symbol: "EUR/USD", name: { vi: "EUR/USD", en: "EUR/USD" }, price: 1.0852, changePercent: 0.19, trend: "up", seed: 14 },
]

// ---------------------------------------------------------------------------
// Brokers
// ---------------------------------------------------------------------------

export type {
  BrokerBadge,
  BrokerCategory,
  Broker,
  BrokerComparison,
} from "@/lib/broker-data"

export {
  brokerPageStats,
  featuredBrokerNames,
  brokerGuides,
  brokers,
  vnStockPlatforms,
  globalPlatforms,
  featuredPlatforms,
  brokerComparisons,
} from "@/lib/broker-data"


// ---------------------------------------------------------------------------
// Header notifications (not listed in dashboard sections)
// ---------------------------------------------------------------------------

export type Notification = {
  title: import("@/lib/market-utils").Bi
  detail: import("@/lib/market-utils").Bi
  time: import("@/lib/market-utils").Bi
}

export const notifications: Notification[] = [
  {
    title: { vi: "VN-Index chạm ngưỡng hỗ trợ", en: "VN-Index hits support level" },
    detail: { vi: "Chỉ số giảm xuống gần vùng 1.280 điểm.", en: "Index slips toward the 1,280 zone." },
    time: { vi: "5 phút trước", en: "5 min ago" },
  },
  {
    title: { vi: "Bitcoin vượt 68.000 USD", en: "Bitcoin crosses $68,000" },
    detail: { vi: "Biến động 24h tăng hơn 2%.", en: "Up more than 2% over 24 hours." },
    time: { vi: "22 phút trước", en: "22 min ago" },
  },
  {
    title: { vi: "Lịch kinh tế: PPI Mỹ", en: "Calendar: US PPI" },
    detail: { vi: "Dữ liệu công bố lúc 19:30 (giờ VN).", en: "Data due at 12:30 GMT." },
    time: { vi: "1 giờ trước", en: "1 hr ago" },
  },
]
