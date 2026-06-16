import "server-only"

import { toApiJson, toApiJsonFromMock } from "@/lib/api-response"
import { getMockHeatmapAssets } from "@/lib/mockHeatmapData"
import { getData as getCryptoData, getMockData as getCryptoMock } from "@/lib/providers/crypto-provider"
import { getData as getVietnamData, getMockData as getVietnamMock } from "@/lib/providers/vietnam-market-provider"
import { getMockData as getGlobalMock } from "@/lib/providers/global-market-provider"
import { CACHE_KEYS, cachedProvider } from "@/lib/providers/cache"
import { getCryptoQuotes } from "@/lib/twelvedata/client"
import type { HeatmapAsset, MarketType } from "@/types/market"
import { overlayHeatmapQuotes } from "./normalize"

const CACHE_TTL_MS = 60_000

const CACHE_BY_MARKET: Record<MarketType, string> = {
  vn: CACHE_KEYS.heatmapVietnam,
  us: CACHE_KEYS.heatmapUs,
  crypto: CACHE_KEYS.heatmapCrypto,
}

function assetToHeatmapRow(
  asset: ReturnType<typeof getMockHeatmapAssets>[number],
): HeatmapAsset {
  return {
    symbol: asset.symbol,
    name: asset.name.en,
    price: asset.price,
    changePercent: asset.changePercent,
    volume: asset.volume,
    sector: asset.sector,
    marketCap: asset.marketCap,
  }
}

function vnTilesToRows(
  heatmapMarket: Awaited<ReturnType<typeof getVietnamData>>["heatmapMarket"],
): HeatmapAsset[] {
  const tiles = heatmapMarket.exchanges?.flatMap((ex) => ex.tiles) ?? heatmapMarket.tiles ?? []
  return tiles.map((tile) => ({
    symbol: tile.symbol,
    name: tile.name.en,
    price: tile.price ?? 0,
    changePercent: tile.changePercent,
    volume: 0,
    sector: "Equity",
    marketCap: 0,
  }))
}

async function fetchVietnamRows(): Promise<{ items: HeatmapAsset[]; source: "live" | "mock" }> {
  try {
    const data = await getVietnamData()
    const items = vnTilesToRows(data.heatmapMarket)
    if (items.length) return { items, source: data.source }
  } catch {
    /* fall through */
  }
  const mock = getVietnamMock()
  return { items: vnTilesToRows(mock.heatmapMarket), source: "mock" }
}

async function fetchUsRows(): Promise<{ items: HeatmapAsset[]; source: "live" | "mock" }> {
  const mockAssets = getMockHeatmapAssets("us")
  let items = mockAssets.map(assetToHeatmapRow)
  try {
    const global = getGlobalMock()
    const liveOverlay = global.quotes.map((q) => ({
      symbol: q.symbol,
      name: q.name,
      price: q.price,
      change: q.change,
      changePercent: q.changePercent,
      open: q.price,
      high: q.price,
      low: q.price,
      volume: 0,
      updatedAt: q.updatedAt,
    }))
    items = overlayHeatmapQuotes(items, liveOverlay)
    return { items, source: "mock" }
  } catch {
    return { items, source: "mock" }
  }
}

async function fetchCryptoRows(): Promise<{ items: HeatmapAsset[]; source: "live" | "mock" }> {
  const mockAssets = getMockHeatmapAssets("crypto")
  let items = mockAssets.map(assetToHeatmapRow)
  try {
    const live = await getCryptoQuotes()
    if (live.length) {
      items = overlayHeatmapQuotes(items, live)
      return { items, source: "live" }
    }
    const data = await getCryptoData()
    items = data.assets.slice(0, 50).map((asset) => ({
      symbol: asset.symbol,
      name: asset.name,
      price: asset.price,
      changePercent: asset.change24h,
      volume: asset.volume24h,
      sector: "Crypto",
      marketCap: asset.marketCap,
    }))
    return { items, source: data.source }
  } catch {
    const mock = getCryptoMock()
    items = mock.assets.slice(0, 50).map((asset) => ({
      symbol: asset.symbol,
      name: asset.name,
      price: asset.price,
      changePercent: asset.change24h,
      volume: asset.volume24h,
      sector: "Crypto",
      marketCap: asset.marketCap,
    }))
    return { items, source: "mock" }
  }
}

export async function fetchHeatmapMarket(
  market: MarketType,
): Promise<{ items: HeatmapAsset[]; source: "live" | "mock"; unavailable: boolean }> {
  try {
    if (market === "vn") {
      const result = await fetchVietnamRows()
      return { ...result, unavailable: result.items.length === 0 }
    }
    if (market === "us") {
      const result = await fetchUsRows()
      return { ...result, unavailable: result.items.length === 0 }
    }
    const result = await fetchCryptoRows()
    return { ...result, unavailable: result.items.length === 0 }
  } catch {
    return { items: [], source: "mock", unavailable: true }
  }
}

const MARKET_ALIASES: Record<string, MarketType> = {
  vn: "vn",
  vietnam: "vn",
  us: "us",
  crypto: "crypto",
}

export function resolveHeatmapMarketParam(raw: string): MarketType | null {
  return MARKET_ALIASES[raw.trim().toLowerCase()] ?? null
}

export async function serveHeatmapMarket(market: MarketType) {
  try {
    const cacheKey = CACHE_BY_MARKET[market]
    const cached = await cachedProvider(
      cacheKey,
      async () => {
        const data = await fetchHeatmapMarket(market)
        return { data, source: data.source === "live" ? ("live" as const) : ("mock" as const) }
      },
      { ttlMs: CACHE_TTL_MS },
    )

    const payload = cached?.data ?? (await fetchHeatmapMarket(market))

    return Response.json(
      toApiJson({
        source: payload.source,
        items: payload.items,
        unavailable: payload.unavailable,
      }),
    )
  } catch {
    return Response.json(
      toApiJsonFromMock({
        source: "mock",
        items: [],
        unavailable: true,
      }),
    )
  }
}
