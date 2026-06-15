import type { AdapterFetchResult, NormalizedVietnamMarket, VietnamAdapterId, VietnamMarketAdapter } from "./types"
import { fireantAdapter } from "./fireant-adapter"
import { tcbsAdapter } from "./tcbs-adapter"
import { vietstockAdapter } from "./vietstock-adapter"

/** Default adapter priority — TCBS first (free public, no API key). */
export const VIETNAM_ADAPTER_PRIORITY: VietnamAdapterId[] = [
  "tcbs",
  "vietstock",
  "fireant",
]

export const VIETNAM_ADAPTERS: Record<VietnamAdapterId, VietnamMarketAdapter> = {
  fireant: fireantAdapter,
  vietstock: vietstockAdapter,
  tcbs: tcbsAdapter,
}

export function getVietnamAdapter(id: VietnamAdapterId): VietnamMarketAdapter {
  return VIETNAM_ADAPTERS[id]
}

export function listVietnamAdapters(): VietnamMarketAdapter[] {
  return VIETNAM_ADAPTER_PRIORITY.map((id) => VIETNAM_ADAPTERS[id])
}

/**
 * Try Vietnam adapters in priority order; returns first successful snapshot.
 */
export async function fetchVietnamMarketFromAdapters(): Promise<
  AdapterFetchResult<NormalizedVietnamMarket>
> {
  let lastError: AdapterFetchResult<NormalizedVietnamMarket> | null = null

  for (const id of VIETNAM_ADAPTER_PRIORITY) {
    const adapter = VIETNAM_ADAPTERS[id]
    if (!adapter.isConfigured()) continue

    const result = await adapter.fetchMarketSnapshot()
    if (result.status === "ok") return result
    lastError = result
  }

  if (lastError) return lastError

  return {
    status: "not_configured",
    provider: VIETNAM_ADAPTER_PRIORITY[0],
    reason: "No Vietnam adapter enabled",
  }
}
