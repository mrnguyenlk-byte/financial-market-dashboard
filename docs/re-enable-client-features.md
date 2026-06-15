# Re-enable client features (staged plan)

**Do not enable all flags at once.** Verify the homepage after each stage with `npm run build` and a manual smoke test at `/`.

Feature flags live in `lib/config/features.ts`.

---

## Current safe defaults

```ts
export const features = {
  symbolModal: false,
  watchlist: false,
  liveClientFetch: false,
  currencyStrength: false,
  clientDebug: true,
}
```

Homepage renders from SSR data in `app/page.tsx`. No client-side API calls.

---

## Stage 1 — Live client fetch

**Change:** `liveClientFetch: true`

**What turns on:** TickerBar, MarketOverview, HeatmapSection, EconomicCalendar, MarketNews client fetches.

**Verification:**

- [ ] Homepage loads without console errors
- [ ] No hydration warnings
- [ ] `GET /api/health` returns service status
- [ ] Skeleton loaders clear after fetch

**Rollback:** `liveClientFetch: false`

---

## Stage 2 — Symbol detail modal

**Prerequisite:** Stage 1 stable.

**Change:** `symbolModal: true`

**What turns on:** `SymbolDetailModal` in layout (lazy client bundle).

**Verification:**

- [ ] Modal open/close works
- [ ] Unknown symbols fail silently
- [ ] Mobile dialog behavior OK

**Rollback:** `symbolModal: false`

---

## Stage 3 — Watchlist

**Prerequisite:** Stages 1–2 stable.

**Change:** `watchlist: true`

**What turns on:** Sidebar watchlist + localStorage + live quotes (if Stage 1 on).

**Verification:**

- [ ] Default symbols on first visit
- [ ] Add/remove persists
- [ ] Private browsing degrades gracefully

**Rollback:** `watchlist: false`

---

## Optional — Currency strength

**Prerequisite:** Licensed or public FX strength feed integrated (see `docs/currency-strength-data-source.md`).

**Change:** `currencyStrength: true`

**Rollback:** Set `currencyStrength: false`.

---

## Optional — Disable debug logging

After all stages pass: `clientDebug: false`

---

## Monitoring

- Health: `GET /api/health`
- Errors: `app/error.tsx`, `app/global-error.tsx`
- Audit: `docs/production-crash-audit.md`
