import "server-only"

import { OVERVIEW_SYMBOLS } from "@/config/market-symbols"
import {
  fetchMarketsOverview,
  getMockOverviewQuotes,
} from "@/lib/market/overview"
import type { NormalizedMarketQuote } from "./types"

/** @deprecated Use OVERVIEW_SYMBOLS from @/config/market-symbols */
export const MARKET_QUOTE_DEFS = OVERVIEW_SYMBOLS.map((s) => ({
  apiSymbol: s.apiSymbol,
  displaySymbol: s.displaySymbol,
  name: s.name,
}))

/** Fetch live market quotes with per-symbol mock fallback. */
export async function fetchMarketQuotes(): Promise<{
  quotes: NormalizedMarketQuote[]
  source: "live" | "mock"
}> {
  const result = await fetchMarketsOverview()
  return {
    quotes: result.quotes,
    source: result.source,
  }
}

export function getMockMarketQuotes(): NormalizedMarketQuote[] {
  return getMockOverviewQuotes()
}

export type { TwelveDataSymbolDef } from "./twelveData"
