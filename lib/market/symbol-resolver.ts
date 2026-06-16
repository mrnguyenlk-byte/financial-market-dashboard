import { findMarketSymbol } from "@/config/market-symbols"

export function resolveMarketSymbolParam(raw: string): string {
  const decoded = decodeURIComponent(raw)
  const def = findMarketSymbol(decoded)
  return def?.apiSymbol ?? decoded
}
