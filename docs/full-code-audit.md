# Full Codebase Audit — BTrading Market Insights

**Date:** 2026-06-16  
**Branch baseline:** `4297fe5` (Production Beta Final)  
**Site:** https://btrading.org  
**Version:** 0.2.0-beta

---

## Verdict Summary

| Category | Count |
|----------|-------|
| KEEP | 42 modules |
| DISABLE | 8 modules (feature-flagged) |
| REMOVE | 4 unused components (removed in Phase 3) |
| RISKY | 6 areas (documented, not enabled) |

---

## App Routes (`app/`)

| Module | Verdict | Notes |
|--------|---------|-------|
| `app/page.tsx` | **KEEP** | SSR dashboard; try/catch + mock fallback |
| `app/brokers/page.tsx` | **KEEP** | Static platforms page |
| `app/contact/page.tsx` | **KEEP** | Static contact page |
| `app/legal/[slug]/page.tsx` | **KEEP** | 6 SSG legal pages; metadata added |
| `app/markets/[symbol]/page.tsx` | **DISABLE** | Returns 404 when `dynamicMarketPages=false` |
| `app/platforms/page.tsx` | **KEEP** | Redirect → `/brokers` |
| `app/error.tsx`, `global-error.tsx` | **KEEP** | Error boundaries at route level |
| `app/layout.tsx` | **KEEP** | Theme init script, i18n, analytics |
| `app/robots.ts` | **KEEP** | Fixed to use `SITE_URL` for sitemap |
| `app/sitemap.ts` | **KEEP** | Stable routes only; markets excluded |

---

## API Routes (`app/api/`)

| Route | Verdict | Notes |
|-------|---------|-------|
| `/api/crypto` | **KEEP** | CoinGecko + mock fallback |
| `/api/global-markets` | **KEEP** | Yahoo/Stooq chain + mock |
| `/api/vietnam-markets` | **KEEP** | TCBS adapter + rich mock |
| `/api/news` | **KEEP** | RSS feeds + mock |
| `/api/calendar` | **KEEP** | Fair Economy + mock |
| `/api/health` | **KEEP** | Ops probe; no secrets exposed |

All routes: `force-dynamic`, never throw, return JSON with `source`/`fallback`/`updatedAt`.

---

## Components — Dashboard (Active)

| Component | Verdict | Notes |
|-----------|---------|-------|
| `header.tsx` | **KEEP** | Nav, theme, language; login hidden on mobile |
| `footer.tsx` | **KEEP** | Legal links, social |
| `sidebar.tsx` | **KEEP** | Banners fixed (CSS layer order) |
| `ticker-bar.tsx` | **KEEP** | Live overlay via SWR |
| `market-overview.tsx` | **KEEP** | Category tabs + sparklines |
| `fear-greed.tsx` | **KEEP** | Crypto sentiment gauge |
| `heatmap.tsx` | **KEEP** | Vietnam HOSE/HNX/UPCoM only |
| `economic-calendar.tsx` | **KEEP** | Client SWR + SSR fallback |
| `market-news.tsx` | **KEEP** | RSS headlines |
| `broker-highlights.tsx` | **KEEP** | Static platform cards |
| `risk-warning.tsx` | **KEEP** | Regulatory disclaimer |
| `contact-fab.tsx` | **KEEP** | Zalo external link |
| `section-error-boundary.tsx` | **KEEP** | Per-widget crash isolation |
| `language-switcher.tsx` | **KEEP** | EN/VI; aria-label added |
| `theme-toggle.tsx` | **KEEP** | Dark/light with hydration guard |
| `data-skeletons.tsx` | **KEEP** | Loading states |
| `shared.tsx` | **KEEP** | SectionHeading with `id` prop |

---

## Components — Feature-Flagged (Disabled)

| Component | Verdict | Flag | Notes |
|-----------|---------|------|-------|
| `watchlist.tsx` | **DISABLE** | `watchlist: false` | Zustand + localStorage |
| `symbol-detail-modal.tsx` | **DISABLE** | `symbolModal: false` | Lazy-loaded chart modal |
| `symbol-detail-modal-lazy.tsx` | **DISABLE** | `symbolModal: false` | Code-split wrapper |
| `currency-strength.tsx` | **DISABLE** | `currencyStrength: false` | Uses lightweight-charts |
| `market-detail-page.tsx` | **DISABLE** | `dynamicMarketPages: false` | Symbol detail SSR page |
| `lightweight-chart.tsx` | **DISABLE** | Used only by disabled features | Heavy chart lib |

---

## Components — Removed (Phase 3)

| Component | Verdict | Reason |
|-----------|---------|--------|
| `top-movers.tsx` | **REMOVE** | Not mounted anywhere |
| `market-breadth.tsx` | **REMOVE** | Not mounted anywhere |
| `currency-performance.tsx` | **REMOVE** | Not mounted anywhere |

---

## UI Primitives (`components/ui/`)

| Component | Verdict | Notes |
|-----------|---------|-------|
| `badge`, `button`, `card`, `dropdown-menu`, `input`, `tabs` | **KEEP** | In active use |
| `avatar`, `scroll-area`, `separator`, `table`, `tooltip` | **KEEP** | shadcn stubs; low bundle impact |

---

## Lib — Providers (`lib/providers/`)

| Module | Verdict | Notes |
|--------|---------|-------|
| `build-dashboard-data.ts` | **KEEP** | SSR assembler |
| `crypto-provider.ts` | **KEEP** | CoinGecko |
| `global-market-provider.ts` | **KEEP** | Yahoo v8/v7 + Stooq |
| `vietnam-market-provider.ts` | **KEEP** | TCBS + mock seeds |
| `news-provider.ts` | **KEEP** | RSS aggregation |
| `economic-provider.ts` | **KEEP** | Fair Economy calendar |
| `calendar-provider.ts` | **KEEP** | Re-export of economic |
| `market-provider.ts` | **KEEP** | Ticker + overview mocks |
| `heatmap-provider.ts` | **KEEP** | Heatmap mock structures |
| `currency-provider.ts` | **DISABLE** | Mock-only; no live FX feed |
| `cache.ts`, `fallback.ts`, `fetch-utils.ts`, `mappers.ts` | **KEEP** | Infrastructure |

---

## Lib — Vietnam Adapters

| Adapter | Verdict | Notes |
|---------|---------|-------|
| `tcbs-adapter.ts` | **KEEP** | Live public API (priority 1) |
| `vietstock-adapter.ts` | **DISABLE** | Stub; needs API key |
| `fireant-adapter.ts` | **DISABLE** | Stub; needs API key |
| `registry.ts`, `normalize.ts` | **KEEP** | Adapter orchestration |

---

## Lib — Client / State

| Module | Verdict | Notes |
|--------|---------|-------|
| `i18n.tsx` | **KEEP** | EN/VI bilingual |
| `theme.tsx` | **KEEP** | useSyncExternalStore pattern |
| `seo.ts` | **KEEP** | Metadata builders |
| `config/features.ts` | **KEEP** | Single source of feature flags |
| `swr/use-market-apis.ts` | **KEEP** | Client API hooks |
| `store/watchlist-store.ts` | **DISABLE** | Only when watchlist enabled |
| `watchlist.ts` | **KEEP** | Types + catalog used by disabled watchlist |
| `symbol-detail-context.tsx` | **DISABLE** | Noop when symbolModal off |
| `currency-strength/*` | **DISABLE** | Engine for disabled feature |

---

## Risky Areas (Do Not Enable in Beta)

| Area | Verdict | Risk |
|------|---------|------|
| Login / Register UI | **RISKY** | No auth backend |
| Header search | **RISKY** | No handler wired |
| Contact form submit | **RISKY** | No API endpoint |
| News "View all" button | **RISKY** | No destination |
| Heatmap timeframe toggles | **RISKY** | UI-only; data unchanged |
| Dynamic market pages | **RISKY** | Incomplete symbol flow |

---

## Public Assets

| Path | Verdict | Notes |
|------|---------|-------|
| `public/banners/promo-trade-bg.png` | **KEEP** | Banner 1 background |
| `public/banners/partner-platform-bg.png` | **KEEP** | Banner 2 background |
| `public/ads/*` | **KEEP** | Legacy assets; not referenced by sidebar |
| `public/brand/*` | **KEEP** | Logo for OG/metadata |

---

## Scripts & Config

| File | Verdict | Notes |
|------|---------|-------|
| `next.config.mjs` | **KEEP** | Redirects, unoptimized images |
| `eslint.config.mjs` | **KEEP** | Lint rules |
| `scripts/check-prod-chunks.mjs` | **KEEP** | Bundle diagnostics |
| `package-lock.json` + `pnpm-lock.yaml` | **RISKY** | Dual lockfiles; pick one PM |

---

## Environment Kill-Switches

| Variable | Default | Effect |
|----------|---------|--------|
| `COINGECKO_ENABLED=false` | Off live crypto |
| `NEWS_RSS_ENABLED=false` | Off RSS |
| `VIETNAM_MARKET_ENABLED=false` | Off VN live |
| `TCBS_ADAPTER_ENABLED=false` | Off TCBS |
| `CURRENCY_STRENGTH_ENABLED=false` | Off FX live |

All default to live fetch in production unless explicitly disabled.
