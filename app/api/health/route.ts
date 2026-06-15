import { getData as getCryptoData, getMockData as getCryptoMock } from "@/lib/providers/crypto-provider"
import {
  getData as getGlobalMarketData,
  getMockData as getGlobalMarketMock,
} from "@/lib/providers/global-market-provider"
import {
  getData as getVietnamMarketData,
  getMockData as getVietnamMarketMock,
} from "@/lib/providers/vietnam-market-provider"
import { getData as getCalendarData, getMockData as getCalendarMock } from "@/lib/providers/calendar-provider"
import { getData as getNewsData, getMockData as getNewsMock } from "@/lib/providers/news-provider"

export const dynamic = "force-dynamic"

type ServiceHealth = {
  ok: boolean
  source: string
  fallback: boolean
}

async function probeService(
  getData: () => Promise<{ source?: string }>,
  getMock: () => { source?: string },
): Promise<ServiceHealth> {
  try {
    const data = await getData()
    const source = data.source ?? "unknown"
    return {
      ok: source === "live",
      source,
      fallback: source !== "live",
    }
  } catch {
    try {
      const mock = getMock()
      return {
        ok: false,
        source: mock.source ?? "mock",
        fallback: true,
      }
    } catch {
      return {
        ok: false,
        source: "mock",
        fallback: true,
      }
    }
  }
}

export async function GET() {
  try {
    const [crypto, globalMarkets, vietnamMarkets, calendar, news] = await Promise.all([
      probeService(getCryptoData, getCryptoMock),
      probeService(getGlobalMarketData, getGlobalMarketMock),
      probeService(getVietnamMarketData, getVietnamMarketMock),
      probeService(getCalendarData, getCalendarMock),
      probeService(getNewsData, getNewsMock),
    ])

    return Response.json({
      status: "ok",
      app: "BTrading Market Insights",
      timestamp: new Date().toISOString(),
      services: {
        crypto,
        globalMarkets,
        vietnamMarkets,
        calendar,
        news,
      },
    })
  } catch {
    return Response.json({
      status: "ok",
      app: "BTrading Market Insights",
      timestamp: new Date().toISOString(),
      services: {
        crypto: { ok: false, source: "unknown", fallback: true },
        globalMarkets: { ok: false, source: "unknown", fallback: true },
        vietnamMarkets: { ok: false, source: "unknown", fallback: true },
        calendar: { ok: false, source: "unknown", fallback: true },
        news: { ok: false, source: "unknown", fallback: true },
      },
    })
  }
}
