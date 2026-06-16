import "server-only"

import { CURRENCY_STRENGTH_PAIRS } from "@/config/market-symbols"
import { buildCurrencyStrengthSnapshot } from "@/lib/currency-strength"
import { REFERENCE_PAIR_QUOTES } from "@/lib/currency-strength/types"
import { getMockStrengths } from "@/lib/providers/currency-provider"
import { getForexPairsForCurrencyStrength } from "@/lib/twelvedata/client"
import type { CurrencyStrengthQuote } from "@/types/market"

const LIVE_CURRENCIES = new Set(["USD", "EUR", "GBP", "JPY", "AUD", "NZD", "CAD", "CHF"])

function toStrengthRows(
  currencies: ReturnType<typeof buildCurrencyStrengthSnapshot>["currencies"],
): CurrencyStrengthQuote[] {
  return currencies
    .filter((c) => LIVE_CURRENCIES.has(c.code))
    .map((c) => ({
      currency: c.code,
      strength: c.strength,
      change: c.changePercent,
      label: c.rankKey,
    }))
}

function mockStrengthRows(): CurrencyStrengthQuote[] {
  try {
    return getMockStrengths()
      .filter((c) => LIVE_CURRENCIES.has(c.code))
      .map((c) => ({
        currency: c.code,
        strength: c.strength,
        change: c.changePercent,
        label: c.rankKey,
      }))
  } catch {
    return []
  }
}

/** Fetch live FX pairs and calculate currency strength scores. */
export async function fetchLiveCurrencyStrength(): Promise<{
  items: CurrencyStrengthQuote[]
  source: "live" | "mock"
  unavailable: boolean
}> {
  try {
    const livePairs = await getForexPairsForCurrencyStrength()

    if (livePairs.length < 4) {
      return { items: mockStrengthRows(), source: "mock", unavailable: livePairs.length === 0 }
    }

    const referenceInputs = CURRENCY_STRENGTH_PAIRS.map((pair) => {
      const symbol = pair.replace("/", "")
      const live = livePairs.find((p) => p.symbol === symbol)
      if (live) {
        return {
          symbol,
          price: live.price,
          changePercent: live.changePercent,
          updatedAt: live.updatedAt,
        }
      }

      const ref = REFERENCE_PAIR_QUOTES[symbol as keyof typeof REFERENCE_PAIR_QUOTES]
      return ref
        ? { symbol, price: ref.price, changePercent: ref.changePercent }
        : null
    }).filter((p): p is NonNullable<typeof p> => p != null)

    const snapshot = buildCurrencyStrengthSnapshot(referenceInputs)
    const rows = toStrengthRows(snapshot.currencies)
    return rows.length
      ? { items: rows, source: "live", unavailable: false }
      : { items: mockStrengthRows(), source: "mock", unavailable: false }
  } catch {
    return { items: mockStrengthRows(), source: "mock", unavailable: true }
  }
}
