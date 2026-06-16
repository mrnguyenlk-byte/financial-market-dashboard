import { serveHeatmapMarket } from "@/lib/market/heatmap"

export const dynamic = "force-dynamic"

/** Legacy alias for /api/heatmaps/vn. */
export async function GET() {
  return serveHeatmapMarket("vn")
}
