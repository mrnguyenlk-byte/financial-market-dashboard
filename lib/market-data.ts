import "server-only"

// Centralized mock data for BTrading Market Insights.
// Illustrative placeholder values only — not real-time prices.
// Replace provider getData() implementations with API responses when wiring live data.

export type { Bi, Trend } from "@/lib/market-utils"
export { toTrend, spark, strengthSeries } from "@/lib/market-utils"

import type { Trend } from "@/lib/market-utils"

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

export {
  currencyPerformance,
  marketBreadthData,
  topMovers,
  type CurrencyPair,
  type MarketBreadth,
  type TopMover,
  type TopMoversData,
} from "@/lib/dashboard-section-mocks"

export {
  fearGreedData,
  fgLabel,
  type FearGreedItem,
} from "@/lib/fear-greed"

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
