"use client"

import { useWatchlistAvailable, useWatchlistStore } from "@/lib/store/watchlist-store"
import type { WatchlistSymbol } from "@/lib/watchlist"

export function useWatchlist() {
  const symbols = useWatchlistStore((s) => s.symbols)
  const add = useWatchlistStore((s) => s.add)
  const remove = useWatchlistStore((s) => s.remove)
  const available = useWatchlistAvailable()

  return { symbols, add, remove, available } satisfies {
    symbols: WatchlistSymbol[]
    add: (symbol: WatchlistSymbol) => void
    remove: (symbol: WatchlistSymbol) => void
    available: WatchlistSymbol[]
  }
}
