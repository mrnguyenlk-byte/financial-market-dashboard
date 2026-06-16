import { fetchLiveCurrencyStrength } from "@/lib/market/currency-strength"
import { toApiJson, toApiJsonFromMock } from "@/lib/api-response"
import { CACHE_KEYS, cachedProvider } from "@/lib/providers/cache"
import { getMockStrengths } from "@/lib/providers/currency-provider"

export const dynamic = "force-dynamic"

const CACHE_TTL_MS = 60_000

function mockRows() {
  return getMockStrengths().map((c) => ({
    currency: c.code,
    strength: c.strength,
    change: c.changePercent,
    label: c.rankKey,
  }))
}

export async function GET() {
  try {
    const cached = await cachedProvider(
      CACHE_KEYS.currencyStrength,
      async () => {
        const result = await fetchLiveCurrencyStrength()
        return {
          data: result,
          source: result.source === "live" ? ("live" as const) : ("mock" as const),
        }
      },
      { ttlMs: CACHE_TTL_MS },
    )

    const result = cached?.data ?? (await fetchLiveCurrencyStrength())

    return Response.json(
      toApiJson({
        source: result.source,
        items: result.items,
        unavailable: result.unavailable,
      }),
    )
  } catch {
    return Response.json(
      toApiJsonFromMock({
        source: "mock",
        items: mockRows(),
        unavailable: true,
      }),
    )
  }
}
