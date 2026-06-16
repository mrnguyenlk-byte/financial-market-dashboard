# Performance Report — BTrading Market Insights

**Date:** 2026-06-16  
**Build:** Next.js 16.2.6 (Turbopack)

---

## Summary

Production build completes in ~8s. No critical bundle bloat on active dashboard path. Heavy libraries isolated to disabled features.

---

## High Priority

| Item | Impact | Recommendation |
|------|--------|----------------|
| SSR + SWR double-fetch | Upstream load doubled on first paint | Consider stale-while-revalidate headers on API routes |
| TCBS 23 parallel requests | Vietnam fetch latency | Batch or reduce stock list; add shared Redis cache |
| `images: { unoptimized: true }` | Larger image payloads | Enable Next Image optimization when stable |

---

## Medium Priority

| Item | Impact | Recommendation |
|------|--------|----------------|
| `lightweight-charts` in bundle | ~200KB+ if loaded | Already gated behind disabled features; verify tree-shake |
| Yahoo 7 parallel chart requests | Global markets latency | Consider single batch endpoint |
| Geist fonts (2 weights) | Render blocking | Acceptable; already optimized by Next |
| `@vercel/analytics` in root layout | Minor | Keep for production insights |
| Dual lockfiles (`npm` + `pnpm`) | Install inconsistency | Standardize on one package manager |

---

## Low Priority

| Item | Impact | Recommendation |
|------|--------|----------------|
| `lucide-react` icon imports | Tree-shaken per icon | OK |
| Unused UI primitives (avatar, table, etc.) | Minimal dead code | Keep for future shadcn use |
| `shadcn` in production deps | Unnecessary dep | Move to devDependencies post-beta |
| In-memory 60s cache | Limited on serverless | Redis when traffic grows |
| All API routes `force-dynamic` | No ISR benefit | Correct for live data |

---

## Bundle Analysis (Active Path)

```
Homepage critical path:
  app/page.tsx (RSC)
  ├── header, ticker-bar, sidebar, fear-greed
  ├── heatmap, economic-calendar, market-news
  ├── broker-highlights, risk-warning, footer
  └── lib/swr/use-market-apis (client refresh)

NOT in active path:
  ├── lightweight-chart.tsx (currency-strength, symbol-modal)
  ├── watchlist.tsx + zustand persist
  └── market-detail-page.tsx
```

---

## Network Fan-Out (Client)

With `liveClientFetch: true`, homepage triggers up to 5 unique SWR keys:
- `/api/vietnam-markets`
- `/api/global-markets`
- `/api/crypto`
- `/api/calendar`
- `/api/news`

SWR deduping interval (30s) prevents duplicate in-flight requests.

---

## Static Assets

| Asset | Size concern | Notes |
|-------|--------------|-------|
| Banner PNGs | ~100–300KB each | CSS gradient fallback reduces perceived load |
| Brand logo | Small | Used for OG |
| Legacy `/ads/*` PNGs | Unused by sidebar | Consider cleanup post-beta |

---

## Build Output

```
Route (app)
┌ ƒ /                    (dynamic SSR)
├ ○ /brokers             (static)
├ ○ /contact             (static)
├ ● /legal/[slug]        (SSG × 6)
├ ƒ /api/*               (dynamic × 6)
├ ○ /robots.txt
└ ○ /sitemap.xml
```

Build time: ~8s compile + ~4s TypeScript

---

## Recommendations Timeline

| When | Action |
|------|--------|
| Now (beta) | No perf changes — stability first |
| v0.3 | Enable Next Image optimization |
| v0.4 | Shared Redis cache for providers |
| v1.0 | Edge caching for static legal/broker pages |
