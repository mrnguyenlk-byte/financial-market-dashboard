import type {
  AdapterFetchResult,
  NormalizedVietnamMarket,
  VietstockRawIndex,
  VietstockRawStock,
  VietnamMarketAdapter,
} from "./types"
import {
  groupStocksByExchange,
  normalizeVietstockIndex,
  normalizeVietstockStock,
} from "./normalize"

/**
 * Vietstock DataFeed adapter — architecture stub only.
 *
 * Documented delivery: commercial API / sync data (contact kinhdoanh@vietstock.vn).
 * Typical datasets: VN-Index, HNX-Index, UPCoM-Index, VN30, HOSE/HNX/UPCOM stocks.
 *
 * Auth: API key issued by Vietstock (env: VIETSTOCK_API_KEY, VIETSTOCK_API_URL)
 */
export const VIETSTOCK_ADAPTER_META = {
  id: "vietstock" as const,
  name: "Vietstock DataFeed",
  capabilities: ["indices", "stocks", "heatmap", "intraday", "eod"] as const,
  baseUrl: "https://dichvu.vietstock.vn",
  requiresAuth: true,
  notes: "Enterprise DataFeed — endpoint paths provided per contract.",
}

export function isVietstockConfigured(): boolean {
  return Boolean(
    process.env.VIETSTOCK_API_KEY?.trim() && process.env.VIETSTOCK_API_URL?.trim(),
  )
}

export function mapVietstockSnapshot(
  rawIndices: VietstockRawIndex[],
  rawStocks: VietstockRawStock[],
): NormalizedVietnamMarket {
  const indices = rawIndices
    .map(normalizeVietstockIndex)
    .filter((row): row is NonNullable<typeof row> => row != null)

  const stocks = rawStocks
    .map(normalizeVietstockStock)
    .filter((row): row is NonNullable<typeof row> => row != null)

  return {
    provider: "vietstock",
    indices,
    stocks: groupStocksByExchange(stocks),
    fetchedAt: new Date().toISOString(),
  }
}

export const vietstockAdapter: VietnamMarketAdapter = {
  meta: {
    ...VIETSTOCK_ADAPTER_META,
    capabilities: [...VIETSTOCK_ADAPTER_META.capabilities],
  },

  isConfigured() {
    return isVietstockConfigured()
  },

  async fetchMarketSnapshot(): Promise<AdapterFetchResult<NormalizedVietnamMarket>> {
    if (!isVietstockConfigured()) {
      return {
        status: "not_configured",
        provider: "vietstock",
        reason: "VIETSTOCK_API_KEY and VIETSTOCK_API_URL are not set",
      }
    }

    return { status: "not_connected", provider: "vietstock" }
  },
}
