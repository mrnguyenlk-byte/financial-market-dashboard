import { serveHeatmapMarket } from "@/lib/market/heatmap"

export const dynamic = "force-dynamic"

/** Legacy alias for /api/heatmaps/us. */
export async function GET() {
  return serveHeatmapMarket("us")
}
