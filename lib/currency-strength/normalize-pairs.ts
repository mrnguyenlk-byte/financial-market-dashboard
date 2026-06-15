import {
  CURRENCY_NAMES,
  PAIR_LEGS,
  REFERENCE_PAIR_QUOTES,
  STRENGTH_PAIRS,
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
  type FxPairQuote,
  type RawFxPairQuote,
  type StrengthPairSymbol,
} from "./types"

const PAIR_SET = new Set<string>(STRENGTH_PAIRS)

export function sanitizePairSymbol(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z]/g, "")
}

export function isStrengthPairSymbol(symbol: string): symbol is StrengthPairSymbol {
  return PAIR_SET.has(symbol)
}

export function parsePairSymbol(raw: string): StrengthPairSymbol | null {
  const symbol = sanitizePairSymbol(raw)
  return isStrengthPairSymbol(symbol) ? symbol : null
}

function validateQuote(raw: RawFxPairQuote): FxPairQuote | null {
  const symbol = parsePairSymbol(raw.symbol)
  if (!symbol) return null
  if (!Number.isFinite(raw.price) || raw.price <= 0) return null
  if (!Number.isFinite(raw.changePercent)) return null

  const legs = PAIR_LEGS[symbol]
  return {
    symbol,
    base: legs.base,
    quote: legs.quote,
    price: raw.price,
    changePercent: Number(raw.changePercent.toFixed(4)),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  }
}

/**
 * Normalize heterogeneous pair inputs into canonical FxPairQuote rows.
 * Later entries override earlier ones for the same symbol.
 */
export function normalizePairQuotes(inputs: RawFxPairQuote[]): FxPairQuote[] {
  const bySymbol = new Map<StrengthPairSymbol, FxPairQuote>()

  for (const input of inputs) {
    const quote = validateQuote(input)
    if (quote) bySymbol.set(quote.symbol, quote)
  }

  return STRENGTH_PAIRS.filter((symbol) => bySymbol.has(symbol)).map(
    (symbol) => bySymbol.get(symbol)!,
  )
}

/** Build normalized quotes from reference mock prices. */
export function referencePairQuotes(): FxPairQuote[] {
  return normalizePairQuotes(
    STRENGTH_PAIRS.map((symbol) => ({
      symbol,
      ...REFERENCE_PAIR_QUOTES[symbol],
    })),
  )
}

/** Map of currency → pairs where that currency appears. */
export function pairCoverage(): Record<CurrencyCode, StrengthPairSymbol[]> {
  const coverage = {} as Record<CurrencyCode, StrengthPairSymbol[]>
  for (const code of SUPPORTED_CURRENCIES) {
    coverage[code] = []
  }

  for (const symbol of STRENGTH_PAIRS) {
    const { base, quote } = PAIR_LEGS[symbol]
    coverage[base].push(symbol)
    coverage[quote].push(symbol)
  }

  return coverage
}

/**
 * When a pair price rises, the base currency strengthens vs the quote currency.
 * Returns per-leg signed change contributions.
 */
export function pairToLegDeltas(quote: FxPairQuote): {
  base: CurrencyCode
  quote: CurrencyCode
  baseDelta: number
  quoteDelta: number
} {
  const change = quote.changePercent
  return {
    base: quote.base,
    quote: quote.quote,
    baseDelta: change,
    quoteDelta: -change,
  }
}

export function missingPairs(quotes: FxPairQuote[]): StrengthPairSymbol[] {
  const present = new Set(quotes.map((q) => q.symbol))
  return STRENGTH_PAIRS.filter((symbol) => !present.has(symbol))
}
