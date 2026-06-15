import { toTrend } from "@/lib/market-utils"

import {
  normalizePairQuotes,
  pairToLegDeltas,
  referencePairQuotes,
} from "./normalize-pairs"
import {
  CURRENCY_NAMES,
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
  type CurrencyStrengthScore,
  type CurrencyStrengthSnapshot,
  type FxPairQuote,
  type PairContribution,
  type RawFxPairQuote,
} from "./types"

const STRENGTH_BASE = 50
const STRENGTH_SCALE = 4
const SERIES_POINTS = 48

type Accumulator = {
  deltaSum: number
  pairCount: number
  contributions: PairContribution[]
}

function emptyAccumulators(): Record<CurrencyCode, Accumulator> {
  const acc = {} as Record<CurrencyCode, Accumulator>
  for (const code of SUPPORTED_CURRENCIES) {
    acc[code] = { deltaSum: 0, pairCount: 0, contributions: [] }
  }
  return acc
}

function accumulateFromPairs(pairs: FxPairQuote[]): Record<CurrencyCode, Accumulator> {
  const acc = emptyAccumulators()

  for (const pair of pairs) {
    const { base, quote, baseDelta, quoteDelta } = pairToLegDeltas(pair)

    acc[base].deltaSum += baseDelta
    acc[base].pairCount += 1
    acc[base].contributions.push({ symbol: pair.symbol, delta: baseDelta })

    acc[quote].deltaSum += quoteDelta
    acc[quote].pairCount += 1
    acc[quote].contributions.push({ symbol: pair.symbol, delta: quoteDelta })
  }

  return acc
}

function averageDelta(acc: Accumulator): number {
  if (acc.pairCount === 0) return 0
  return Number((acc.deltaSum / acc.pairCount).toFixed(4))
}

function rawStrength(changePercent: number): number {
  return Number((STRENGTH_BASE + changePercent * STRENGTH_SCALE).toFixed(2))
}

function clampStrength(value: number): number {
  return Math.min(100, Math.max(0, value))
}

/**
 * Build a synthetic intraday series ending at the current strength value.
 * Used until a live time-series feed is available.
 */
export function buildStrengthSeries(
  strength: number,
  changePercent: number,
  points = SERIES_POINTS,
): number[] {
  const out: number[] = []
  const step = changePercent / Math.max(points - 1, 1)

  for (let i = 0; i < points; i++) {
    const reverseIndex = points - 1 - i
    const drift = step * reverseIndex
    const wobble = Math.sin((strength + i) * 0.31) * 0.35
    out.push(Number(clampStrength(strength - drift + wobble).toFixed(2)))
  }

  out[out.length - 1] = strength
  return out
}

const RANK_KEYS_BY_POSITION: Record<number, string> = {
  1: "strength.strongest",
  2: "strength.veryStrong",
}

function rankKeyForPosition(rank: number, total: number): string {
  if (rank <= 2) return RANK_KEYS_BY_POSITION[rank]

  const ratio = rank / total
  if (ratio <= 0.45) return "strength.strong"
  if (ratio <= 0.7) return "strength.neutral"
  if (ratio < 1) return "strength.weak"
  return "strength.weakest"
}

function assignRanks(scores: CurrencyStrengthScore[]): CurrencyStrengthScore[] {
  const sorted = [...scores].sort((a, b) => b.strength - a.strength)
  const rankByCode = new Map<CurrencyCode, number>()

  sorted.forEach((entry, index) => {
    rankByCode.set(entry.code, index + 1)
  })

  return scores.map((entry) => {
    const rank = rankByCode.get(entry.code) ?? scores.length
    return {
      ...entry,
      rank,
      rankKey: rankKeyForPosition(rank, scores.length),
    }
  })
}

export function calculateCurrencyStrength(
  pairs: FxPairQuote[],
): CurrencyStrengthScore[] {
  const acc = accumulateFromPairs(pairs)

  const preliminary = SUPPORTED_CURRENCIES.map((code) => {
    const bucket = acc[code]
    const changePercent = averageDelta(bucket)
    const strength = clampStrength(rawStrength(changePercent))

    return {
      code,
      name: CURRENCY_NAMES[code],
      strength,
      changePercent,
      trend: toTrend(changePercent),
      rankKey: "strength.neutral",
      rank: 0,
      series: buildStrengthSeries(strength, changePercent),
      contributions: bucket.contributions,
      pairCount: bucket.pairCount,
    }
  })

  return assignRanks(preliminary)
}

export function buildCurrencyStrengthSnapshot(
  inputs: RawFxPairQuote[],
): CurrencyStrengthSnapshot {
  const pairs = normalizePairQuotes(inputs)
  const currencies = calculateCurrencyStrength(pairs)

  return {
    currencies,
    pairsUsed: pairs.map((p) => p.symbol),
    calculatedAt: new Date().toISOString(),
  }
}

/** Convenience entry using bundled reference pair quotes. */
export function calculateReferenceStrength(): CurrencyStrengthSnapshot {
  const pairs = referencePairQuotes()
  return {
    currencies: calculateCurrencyStrength(pairs),
    pairsUsed: pairs.map((p) => p.symbol),
    calculatedAt: new Date().toISOString(),
  }
}
