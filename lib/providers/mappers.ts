import "server-only"

import type { Bi } from "@/lib/market-utils"
import type { CryptoAsset } from "@/lib/providers/crypto-provider"
import type { GlobalQuote } from "@/lib/providers/global-market-provider"
import type { HeatmapMarket, HeatmapTile } from "@/lib/providers/heatmap-provider"
import type {
  CurrencyStrength,
  DataSource,
  MarketHeatmap,
  MarketHeatmapRegion,
  MarketIndex,
  MarketIndexCategory,
  EconomicEvent,
  EconomicEventRecord,
} from "@/lib/providers/types"
import type { VietnamMarketIndex } from "@/lib/providers/vietnam-market-provider"

const COUNTRY_FLAGS: Record<string, string> = {
  VN: "🇻🇳",
  US: "🇺🇸",
  UK: "🇬🇧",
  JP: "🇯🇵",
  EU: "🇪🇺",
  CN: "🇨🇳",
}

function biLabel(value: Bi | string): string {
  return typeof value === "string" ? value : value.en
}

export function vietnamIndexToMarketIndex(index: VietnamMarketIndex): MarketIndex {
  return {
    symbol: index.symbol,
    name: biLabel(index.name),
    region: "vietnam",
    category: "indices",
    exchange: index.exchange,
    price: index.price,
    change: index.change,
    changePercent: index.changePercent,
    volume: index.volume,
    updatedAt: index.updatedAt,
    source: index.source,
  }
}

export function globalQuoteToMarketIndex(quote: GlobalQuote): MarketIndex {
  return {
    symbol: quote.symbol,
    name: quote.name,
    region: "global",
    category: quote.category as MarketIndexCategory,
    price: quote.price,
    change: quote.change,
    changePercent: quote.changePercent,
    updatedAt: quote.updatedAt,
    source: quote.source,
  }
}

export function cryptoAssetToMarketIndex(asset: CryptoAsset, source: DataSource): MarketIndex {
  const changePercent = Number(asset.change24h.toFixed(2))
  const change = Number((asset.price * (changePercent / 100)).toFixed(2))

  return {
    symbol: `${asset.symbol}/USD`,
    name: asset.name,
    region: "crypto",
    category: "crypto",
    price: asset.price,
    change,
    changePercent,
    volume: asset.volume24h,
    updatedAt: new Date().toISOString(),
    source,
  }
}

export function heatmapTileToMarketHeatmapTile(tile: HeatmapTile): MarketHeatmap["tiles"][number] {
  return {
    symbol: tile.symbol,
    name: tile.name,
    changePercent: tile.changePercent,
    weight: tile.weight,
    price: tile.price,
  }
}

export function heatmapMarketToMarketHeatmap(
  market: HeatmapMarket,
  source: DataSource,
  updatedAt: string,
): MarketHeatmap {
  const tiles = (market.tiles ?? []).map(heatmapTileToMarketHeatmapTile)

  return {
    id: market.id as MarketHeatmapRegion,
    labelKey: market.labelKey,
    flag: market.flag,
    tiles,
    source,
    updatedAt,
  }
}

export function economicRecordToEvent(record: EconomicEventRecord): EconomicEvent {
  return {
    id: record.id,
    time: record.time,
    country: record.country,
    flag: COUNTRY_FLAGS[record.country] ?? "🌐",
    event: { vi: record.event, en: record.event },
    impact: record.impact,
    actual: record.actual,
    forecast: record.forecast,
    previous: record.previous,
  }
}

export function toEconomicEvents(records: EconomicEventRecord[]): EconomicEvent[] {
  return records.map(economicRecordToEvent)
}

export function currencyStrengthFromItem(
  item: Omit<CurrencyStrength, "source">,
  source: DataSource,
): CurrencyStrength {
  return { ...item, source }
}
