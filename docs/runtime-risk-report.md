# Runtime Risk Report — BTrading Market Insights

**Date:** 2026-06-16  
**Scope:** `app/`, `components/`, `lib/`  
**Build:** `npm run build` passes

---

## Executive Summary

No critical runtime crash vectors found on the production dashboard. All homepage widgets are wrapped in `SectionErrorBoundary`. Server providers never throw to the client. Client components do not import server-only provider modules.

---

## Hydration Risks

| Location | Severity | Status |
|----------|----------|--------|
| Theme (`app/layout.tsx` inline script + `lib/theme.tsx`) | Low | **Mitigated** — `suppressHydrationWarning`, `useSyncExternalStore` |
| Live price overlays (SWR after SSR) | Medium | **Accepted** — numbers may shift post-hydration; UX not crash |
| Language default `"en"` every load | Low | **Accepted** — no persistence by design |
| Watchlist Zustand persist | Low | **N/A** — feature disabled |

---

## window / document / localStorage Usage

| File | Guard | Verdict |
|------|-------|---------|
| `app/layout.tsx` theme script | try/catch | Safe |
| `lib/theme.tsx` | Client-only via `useSyncExternalStore` + `typeof window` in subscribe | Safe |
| `lib/watchlist.ts` | `typeof window !== "undefined"` checks | Safe (disabled feature) |
| `lib/store/watchlist-store.ts` | Zustand persist | Safe when watchlist disabled |
| `components/marketwall/lightweight-chart.tsx` | `typeof window` in `cssVar()` | Safe (disabled feature) |

---

## Server / Client Boundary

| Check | Result |
|-------|--------|
| Client components import `@/lib/providers/*` | **None found** |
| `server-only` on providers/adapters | **Present** |
| API routes return JSON on error | **Yes** — mock fallback always |
| Homepage SSR try/catch | **Yes** — `app/page.tsx` lines 33–46 |

---

## Circular Import Check

No circular dependencies detected between:
- `lib/providers/build-dashboard-data.ts` → individual providers
- `components/marketwall/*` → `lib/swr/*` → `/api/*`
- `lib/i18n.tsx` ↔ components (one-way import)

---

## API / Network Risks

| Risk | Mitigation |
|------|------------|
| CoinGecko rate limit | Mock fallback; 60s in-memory cache |
| Yahoo blocking | Stooq fallback chain |
| TCBS downtime | Rich Vietnam mock (19 stocks × 3 exchanges) |
| RSS feed failure | Static bilingual mock headlines |
| Calendar API failure | 7 mock events |
| Serverless cold start | Per-instance cache; acceptable for beta |

---

## Fixes Applied (Phase 4)

1. **Banner CSS layers** — Image was hidden behind full-cover gradient; layer order corrected in `sidebar.tsx`.
2. **Section heading IDs** — Fixed broken `aria-labelledby` references on active dashboard sections.
3. **Legal page metadata** — Added `generateMetadata` to prevent generic OG tags on legal pages.
4. **Robots sitemap URL** — Uses `SITE_URL` env instead of hardcoded domain.

---

## Remaining Accepted Risks

| Item | Severity | Action |
|------|----------|--------|
| Non-functional UI controls (search, view-all) | Low | Document; wire post-beta |
| SSR + SWR double-fetch on first paint | Low | Intentional refresh |
| In-memory cache not shared across instances | Low | Accept for beta scale |
| `images: { unoptimized: true }` | Low | No Next image pipeline |

---

## Production Crash Test Checklist

- [x] Homepage renders with live data failure (mock fallback)
- [x] Homepage renders with all providers throwing
- [x] Each section isolated by error boundary
- [x] `/api/health` returns degraded status without crash
- [x] Dark mode toggle does not hydration-error
- [x] Language switch EN ↔ VI on banners and sections
- [x] Build completes without TypeScript errors
