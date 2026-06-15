# Currency strength data source

**Status (2026-06-15):** Section hidden (`features.currencyStrength: false`).

## Requirement

BTrading must not ship a custom FX strength algorithm. Strength scores must come from a reliable, documented third-party feed.

## Research summary

| Source | Type | Verdict |
|--------|------|---------|
| [Oanor Currency Index API](https://www.oanor.com/api/currencyindex-api) | REST (DXY / custom index from supplied rates) | Requires API key; free tier ~100 calls/month — not suitable for homepage polling |
| BellsForex / GrandAlgo / currencystrengthmeter.co.uk | Web widgets | No stable public API; scraping would be brittle |
| Frankfurter / ExchangeRate-API | Spot FX rates only | Rates only — computing strength would be a custom algorithm (out of scope) |
| Twelve Data / OANDA / Alpha Vantage | Commercial FX | Paid or key-gated; not wired in this repo |

## Decision

**Hide the Currency Strength block** until a production-grade feed is integrated (e.g. licensed FX aggregator with explicit strength or index endpoints).

Mock data remains in `lib/providers/currency-provider.ts` and `lib/currency-strength-mock.ts` for future wiring and local dev.

## Re-enable checklist

1. Choose provider with SLA, documented strength/index semantics, and stable quotas.
2. Add server provider + `/api/currency-strength` route (keep client off server modules).
3. Set `features.currencyStrength: true` in `lib/config/features.ts`.
4. Verify chart renders via TradingView Lightweight Charts with live series.
5. Run `npm run build` and smoke-test `/`.

See also: `docs/re-enable-client-features.md`.
