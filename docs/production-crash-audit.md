# Production crash audit

Audit date: 2026-06-15  
Scope: homepage stability (`app/page.tsx`), layout shell, marketwall client widgets, providers, symbol/watchlist modules.

Prior decoupling commits: `88719ef`, `e1a71df`, `4b35f52` (server/client bundle split).

## Executive summary

The homepage is a **server component** that SSRs mock-enriched dashboard data, then **six client widgets** optionally re-fetch live quotes in `useEffect`. The highest crash/hydration risk comes from **parallel client fetches**, **watchlist localStorage**, and **SymbolDetailModal + context** wiring in the root layout—not from direct server-provider imports in client code.

With `lib/config/features.ts` defaults (`liveClientFetch: false`, `watchlist: false`, `symbolModal: false`), the homepage renders from SSR/static fallbacks only.

---

## Files audited

| Area | Paths |
|------|--------|
| App shell | `app/layout.tsx`, `app/page.tsx`, `app/error.tsx`, `app/global-error.tsx` |
| Marketwall | `components/marketwall/*` |
| Providers | `lib/providers/*` |
| Adapters | `lib/adapters/vietnam/*` |
| Symbol | `lib/symbol-detail.ts`, `lib/symbol-detail-context.tsx`, `lib/symbol-heatmap-registry.ts` |
| Watchlist | `lib/watchlist.ts`, `lib/watchlist-quotes.ts`, `lib/use-watchlist.ts` |

---

## Findings

### 1. Client components importing server providers

**Status: PASS (no direct imports)**

Client widgets do **not** import `@/lib/providers/*`. They call `/api/*` routes from `useEffect`. Server-only usage is confined to `app/page.tsx` and API route handlers.

**Layout note:** `app/layout.tsx` wraps the tree in client providers and optionally renders `SymbolDetailModal` via `symbol-detail-modal-lazy.tsx` (client-only dynamic import).

### 2. Circular imports

**Status: LOW RISK**

No circular dependency detected among audited paths.

### 3. localStorage outside useEffect

| Location | Assessment |
|----------|------------|
| `lib/watchlist.ts` | Guarded; used via `useSyncExternalStore` with server snapshot |
| `lib/theme.tsx` | Reads/writes in `useEffect` and handlers only |
| `app/layout.tsx` theme script | Pre-hydration FOUC prevention |

### 4. window / document outside useEffect

| Location | Assessment |
|----------|------------|
| `lib/watchlist.ts` | Store subscription only |
| `symbol-detail-modal.tsx` | `<dialog>` in `useEffect` |
| Theme script | Pre-hydration, acceptable |

### 5. Async client components

**Status: PASS** — all network I/O in `useEffect`.

### 6. Unstable hydration values

| Location | Risk | Notes |
|----------|------|-------|
| `useWatchlist` | Mitigated | `useSyncExternalStore` + fixed server snapshot |
| `spark()` | Low | Deterministic trig from seed |
| Client fetch overlays | Medium | Disabled when `liveClientFetch=false` |

### 7. Math.random / Date.now during render

**Status: PASS in UI render path** — `spark()` is deterministic; `Date.now()` only in server cache/TTL.

### 8. Invalid JSON parsing

`lib/watchlist.ts` `parseStored` uses try/catch with `DEFAULT_WATCHLIST` fallback.

### 9. Undefined map / filter / reduce

| Location | Risk | Mitigation |
|----------|------|------------|
| `buildDashboardData()` | Was HIGH | Null-safe heatmap assembly + mock fallback |
| Client merges | Low | Optional chaining on API fields |

### 10. Missing fallback arrays

Server page + each widget accepts SSR/mock fallback props. Watchlist uses mock quote map when fetch disabled.

### 11. API fetch without fallback

All fetchers use try/catch. Skipped entirely when `liveClientFetch=false`.

**Fetching widgets (when enabled):** ticker-bar, market-overview, heatmap, economic-calendar, market-news, watchlist.

---

## Provider layer

`withFallback()` returns `{ data, source, fallback, error? }`. API routes never throw to clients.

---

## Safe-mode configuration

```ts
// lib/config/features.ts
symbolModal: false
watchlist: false
liveClientFetch: false
clientDebug: true
```

Re-enable plan: `docs/re-enable-client-features.md`.

---

## Residual risks (when flags re-enabled)

1. Hydration mismatch after live fetch updates
2. Watchlist localStorage edge cases
3. SymbolDetailModal + dialog API on mobile
4. Parallel API storm on first paint

Monitor via `GET /api/health`.
