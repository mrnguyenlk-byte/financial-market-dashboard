import "server-only"

import { CURRENCY_STRENGTH_PAIRS } from "@/config/market-symbols"
import type { NormalizedMarketQuote } from "@/lib/market-types"
import { getQuote, getQuotes } from "@/lib/twelvedata/client"

/** @deprecated Use MarketSymbolDef from @/config/market-symbols */
export type TwelveDataSymbolDef = {
  apiSymbol: string
  displaySymbol: string
  name: string
}

/** Fetch a single quote from Twelve Data. */
export async function fetchTwelveDataQuote(
  def: TwelveDataSymbolDef,
): Promise<NormalizedMarketQuote | null> {
  try {
    return await getQuote(def.apiSymbol)
  } catch {
    return null
  }
}

/** Fetch multiple quotes in one batch request. */
export async function fetchTwelveDataQuotes(
  defs: TwelveDataSymbolDef[],
): Promise<NormalizedMarketQuote[]> {
  try {
    if (defs.length === 0) return []
    return await getQuotes(defs.map((d) => d.apiSymbol))
  } catch {
    return []
  }
}

/** Fetch FX pair price + change for currency strength. */
export async function fetchTwelveDataFxPair(
  pair: string,
): Promise<{ symbol: string; price: number; changePercent: number; updatedAt: string } | null> {
  try {
    const quote = await getQuote(pair)
    if (!quote) return null

    return {
      symbol: pair.replace("/", ""),
      price: quote.price,
      changePercent: quote.changePercent,
      updatedAt: quote.updatedAt,
    }
  } catch {
    return null
  }
}

/** @deprecated Import CURRENCY_STRENGTH_PAIRS from @/config/market-symbols */
export const STRENGTH_FX_PAIRS = CURRENCY_STRENGTH_PAIRS
