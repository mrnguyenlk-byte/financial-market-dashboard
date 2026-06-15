import type { Bi, Trend } from "@/lib/market-utils"

/** Where provider data originated. */
export type DataSource = "live" | "mock" | "cache"

export type MarketRegion = "vietnam" | "global" | "crypto"

export type MarketIndexCategory = "indices" | "commodities" | "forex" | "crypto"

/** Canonical index quote used across Vietnam, global, and crypto feeds. */
export type MarketIndex = {
  symbol: string
  name: string
  region: MarketRegion
  category: MarketIndexCategory
  exchange?: string
  price: number
  change: number
  changePercent: number
  volume?: number
  updatedAt: string
  source: DataSource
}

export type MarketHeatmapRegion = "vietnam" | "us" | "crypto"

export type MarketHeatmapTile = {
  symbol: string
  name: Bi
  changePercent: number
  weight: number
  price?: number
}

/** Canonical heatmap payload for a single market region. */
export type MarketHeatmap = {
  id: MarketHeatmapRegion
  labelKey: string
  flag: string
  tiles: MarketHeatmapTile[]
  source: DataSource
  updatedAt: string
}

/** Canonical currency strength row for charts and rankings. */
export type CurrencyStrength = {
  code: string
  name: Bi
  strength: number
  changePercent: number
  trend: Trend
  rankKey: string
  series: number[]
  source: DataSource
}

/** UI-facing economic calendar event. */
export type EconomicEvent = {
  id: string
  time: string
  country: string
  flag: string
  event: Bi
  impact: "high" | "medium" | "low"
  actual: string
  forecast: string
  previous: string
}

/** Normalized economic event record from upstream APIs. */
export type EconomicEventRecord = {
  id: string
  time: string
  country: string
  currency: string
  event: string
  impact: "high" | "medium" | "low"
  previous: string
  forecast: string
  actual: string
  source: string
  publishedAt: string
}

export type EconomicCalendarData = {
  normalized: EconomicEventRecord[]
  vietnam: EconomicEvent[]
  global: EconomicEvent[]
  events: EconomicEvent[]
  source: DataSource
}
