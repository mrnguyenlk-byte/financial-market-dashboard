import {
  MARKET_PAGE_SLUGS,
  getMarketPageSymbol,
  isMarketPageSlug,
  marketPagePath,
  type MarketPageSlug,
  type SymbolDetailRecord,
} from "@/lib/symbol-detail"

export { MARKET_PAGE_SLUGS, isMarketPageSlug, marketPagePath, type MarketPageSlug }

export function getMarketPageRecords(): SymbolDetailRecord[] {
  return MARKET_PAGE_SLUGS.map((slug) => getMarketPageSymbol(slug)).filter(
    (record): record is SymbolDetailRecord => record != null,
  )
}

export function getMarketPageStaticParams(): { symbol: MarketPageSlug }[] {
  return MARKET_PAGE_SLUGS.map((symbol) => ({ symbol }))
}
