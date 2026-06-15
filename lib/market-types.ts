/** Client-safe market types (type-only re-exports, no provider runtime). */

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

export type { CryptoAsset } from "@/lib/providers/crypto-provider"
export type { GlobalQuote } from "@/lib/providers/global-market-provider"
export type { VietnamMarketIndex } from "@/lib/providers/vietnam-market-provider"
