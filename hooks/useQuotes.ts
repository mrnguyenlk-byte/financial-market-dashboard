"use client"

import useSWR from "swr"

import { features } from "@/lib/config/features"
import type { NormalizedMarketQuote } from "@/lib/market-types"
import { jsonFetcher } from "@/lib/swr/fetcher"
import { SWR_KEYS } from "@/lib/swr/keys"

export type QuotesResponse = {
  source?: "live" | "mock"
  quotes?: NormalizedMarketQuote[]
  fallback?: boolean
  unavailable?: boolean
  updatedAt?: string
}

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 30_000,
  errorRetryCount: 2,
} as const

/** Live market quotes from GET /api/markets/overview (30s cache). */
export function useQuotes() {
  return useSWR<QuotesResponse>(
    features.liveClientFetch ? SWR_KEYS.marketsOverview : null,
    jsonFetcher<QuotesResponse>,
    swrOptions,
  )
}

/** @deprecated Use useQuotes — same data from /api/markets/overview */
export function useMarketsOverview() {
  return useQuotes()
}
