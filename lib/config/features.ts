export const features = {
  symbolModal: false,
  watchlist: false,
  liveClientFetch: false,
  /** Hidden until a reliable public FX strength feed is wired. */
  currencyStrength: false,
  clientDebug: true,
} as const

export type FeatureFlags = typeof features

/** Dev-only client logging gated by `features.clientDebug`. */
export function clientDebug(label: string, ...args: unknown[]): void {
  if (features.clientDebug && process.env.NODE_ENV === "development") {
    console.debug(`[BTrading] ${label}`, ...args)
  }
}
