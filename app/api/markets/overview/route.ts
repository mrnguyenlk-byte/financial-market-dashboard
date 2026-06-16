import { fetchMarketsOverview, getMockOverviewQuotes } from "@/lib/market/overview"
import { toApiJson, toApiJsonFromMock } from "@/lib/api-response"
import { CACHE_KEYS, cachedProvider } from "@/lib/providers/cache"

export const dynamic = "force-dynamic"

const CACHE_TTL_MS = 30_000

export async function GET() {
  try {
    const cached = await cachedProvider(
      CACHE_KEYS.marketsOverview,
      async () => {
        const data = await fetchMarketsOverview()
        return {
          data,
          source: data.source === "live" ? ("live" as const) : ("mock" as const),
        }
      },
      { ttlMs: CACHE_TTL_MS },
    )

    const payload = cached?.data ?? (await fetchMarketsOverview())

    return Response.json(
      toApiJson({
        source: payload.source,
        quotes: payload.quotes,
        unavailable: payload.unavailable,
      }),
    )
  } catch {
    const mock = getMockOverviewQuotes()
    return Response.json(
      toApiJsonFromMock({
        source: "mock",
        quotes: mock,
        unavailable: mock.length === 0,
      }),
    )
  }
}
