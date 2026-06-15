import type {
  AdapterFetchResult,
  FireantRawIndex,
  FireantRawStock,
  NormalizedVietnamMarket,
  VietnamMarketAdapter,
} from "./types"
import {
  groupStocksByExchange,
  normalizeFireantIndex,
  normalizeFireantStock,
} from "./normalize"

/**
 * FireAnt adapter — architecture stub only.
 *
 * Documented endpoints (integration phase):
 * - GET https://restv2.fireant.vn/symbols
 * - GET https://restv2.fireant.vn/symbols/{symbol}/quote
 * - GET https://restv2.fireant.vn/markets/indexes
 *
 * Auth: API key / OAuth (env: FIREANT_API_KEY)
 */
export const FIREANT_ADAPTER_META = {
  id: "fireant" as const,
  name: "FireAnt",
  capabilities: ["indices", "stocks", "heatmap", "intraday"] as const,
  baseUrl: "https://restv2.fireant.vn",
  requiresAuth: true,
  notes: "Public quote endpoints may require token. Prefer restv2 over legacy api.fireant.vn.",
}

export function isFireantConfigured(): boolean {
  return Boolean(process.env.FIREANT_API_KEY?.trim())
}

/** Map raw FireAnt payloads to canonical snapshot. Used when HTTP layer is wired. */
export function mapFireantSnapshot(
  rawIndices: FireantRawIndex[],
  rawStocks: FireantRawStock[],
): NormalizedVietnamMarket {
  const indices = rawIndices
    .map(normalizeFireantIndex)
    .filter((row): row is NonNullable<typeof row> => row != null)

  const stocks = rawStocks
    .map(normalizeFireantStock)
    .filter((row): row is NonNullable<typeof row> => row != null)

  return {
    provider: "fireant",
    indices,
    stocks: groupStocksByExchange(stocks),
    fetchedAt: new Date().toISOString(),
  }
}

export const fireantAdapter: VietnamMarketAdapter = {
  meta: {
    ...FIREANT_ADAPTER_META,
    capabilities: [...FIREANT_ADAPTER_META.capabilities],
  },

  isConfigured() {
    return isFireantConfigured()
  },

  async fetchMarketSnapshot(): Promise<AdapterFetchResult<NormalizedVietnamMarket>> {
    if (!isFireantConfigured()) {
      return {
        status: "not_configured",
        provider: "fireant",
        reason: "FIREANT_API_KEY is not set",
      }
    }

    return { status: "not_connected", provider: "fireant" }
  },
}
