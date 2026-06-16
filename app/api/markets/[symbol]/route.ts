import { resolveMarketSymbolParam } from "@/lib/market/symbol-resolver"
import { toApiJson, toApiJsonFromMock } from "@/lib/api-response"
import { getMarketDetail } from "@/lib/twelvedata/client"

export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{ symbol: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { symbol: rawSymbol } = await context.params
  const apiSymbol = resolveMarketSymbolParam(rawSymbol)

  try {
    const detail = await getMarketDetail(apiSymbol)
    const source = detail.quote ? ("live" as const) : ("mock" as const)

    return Response.json(
      toApiJson({
        source,
        symbol: rawSymbol,
        quote: detail.quote,
        timeSeries: detail.timeSeries,
        unavailable: !detail.quote,
      }),
    )
  } catch {
    return Response.json(
      toApiJsonFromMock({
        source: "mock",
        symbol: rawSymbol,
        quote: null,
        timeSeries: [],
        unavailable: true,
      }),
    )
  }
}
