"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
  addWatchlistSymbol,
  DEFAULT_WATCHLIST,
  getAvailableWatchlistSymbols,
  isWatchlistSymbol,
  removeWatchlistSymbol,
  WATCHLIST_STORAGE_KEY,
  type WatchlistSymbol,
} from "@/lib/watchlist"

type WatchlistState = {
  symbols: WatchlistSymbol[]
  _hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  add: (symbol: WatchlistSymbol) => void
  remove: (symbol: WatchlistSymbol) => void
}

function sanitizeSymbols(raw: unknown): WatchlistSymbol[] {
  if (!Array.isArray(raw)) return [...DEFAULT_WATCHLIST]
  const symbols = raw.filter((entry): entry is WatchlistSymbol => isWatchlistSymbol(String(entry)))
  return symbols.length ? symbols : [...DEFAULT_WATCHLIST]
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      symbols: [...DEFAULT_WATCHLIST],
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),
      add: (symbol) => {
        set({ symbols: addWatchlistSymbol(get().symbols, symbol) })
      },
      remove: (symbol) => {
        set({ symbols: removeWatchlistSymbol(get().symbols, symbol) })
      },
    }),
    {
      name: WATCHLIST_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ symbols: state.symbols }),
      merge: (persisted, current) => {
        const stored = persisted as Partial<WatchlistState> | undefined
        return {
          ...current,
          symbols: sanitizeSymbols(stored?.symbols),
        }
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export function useWatchlistAvailable(): WatchlistSymbol[] {
  const symbols = useWatchlistStore((s) => s.symbols)
  return getAvailableWatchlistSymbols(symbols)
}
