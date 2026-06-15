export { DEFAULT_FETCH_TIMEOUT_MS, fetchWithTimeout, safeFetchJson } from "./fetch-utils"

export {
  DEFAULT_CACHE_TTL_MS,
  CACHE_KEYS,
  getCached,
  setCached,
  clearProviderCache,
  cachedProvider,
} from "./cache"

export {
  withFallback,
  chainProviders,
  type ProviderResult,
} from "./fallback"

export type {
  DataSource,
  MarketRegion,
  MarketIndexCategory,
  MarketIndex,
  MarketHeatmapRegion,
  MarketHeatmapTile,
  MarketHeatmap,
  CurrencyStrength,
  EconomicEvent,
  EconomicEventRecord,
  EconomicCalendarData,
} from "./types"

export {
  vietnamIndexToMarketIndex,
  globalQuoteToMarketIndex,
  cryptoAssetToMarketIndex,
  heatmapTileToMarketHeatmapTile,
  heatmapMarketToMarketHeatmap,
  economicRecordToEvent,
  toEconomicEvents,
  currencyStrengthFromItem,
} from "./mappers"

export {
  getData as getCryptoData,
  getMockData as getCryptoMockData,
  getHeatmapData as getCryptoHeatmapData,
  type CryptoData,
  type CryptoAsset,
  type CryptoQuote,
} from "./crypto-provider"

export {
  getData as getGlobalMarketData,
  getMockData as getGlobalMarketMockData,
  type GlobalMarketData,
  type GlobalQuote,
  type GlobalQuoteCategory,
} from "./global-market-provider"

export {
  getData as getVietnamMarketData,
  getMockData as getVietnamMarketMockData,
  type VietnamMarketData,
  type VietnamMarketIndex,
  type VietnamHeatmapStock,
  type VietnamIndex,
} from "./vietnam-market-provider"

export {
  getData as getNewsData,
  getMockData as getNewsMockData,
  type NewsData,
  type MarketNewsItem,
} from "./news-provider"

export {
  getData as getEconomicData,
  getMockData as getEconomicMockData,
} from "./economic-provider"

export {
  getData as getCalendarData,
  getMockData as getCalendarMockData,
  type CalendarData,
  type CalendarEventRecord,
} from "./calendar-provider"

export { buildDashboardData, type DashboardData } from "./build-dashboard-data"

export {
  getData as getMarketData,
  getMockData as getMarketMockData,
  getIndicesData,
  getMockIndices,
  type MarketData,
  type MarketIndicesData,
  type TickerBarItem,
  type MarketTicker,
  type SidebarOverviewItem,
  type OverviewCategory,
  type OverviewListItem,
  type MarketAsset,
} from "./market-provider"

export {
  getData as getHeatmapData,
  getMockData as getHeatmapMockData,
  type HeatmapData,
  type HeatmapTile,
  type HeatmapMarketId,
  type VnExchangeId,
  type HeatmapExchange,
  type HeatmapMarket,
} from "./heatmap-provider"

export {
  getData as getCurrencyData,
  getDataAsync as getCurrencyDataAsync,
  getMockData as getCurrencyMockData,
  getMockStrengths,
  type CurrencyData,
  type CurrencyStrengthItem,
  type CurrencyStrengthChartMeta,
} from "./currency-provider"
