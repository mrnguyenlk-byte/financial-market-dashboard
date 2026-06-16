# Vietnam Market Roadmap — Architecture Research

**Date:** 2026-06-16  
**Status:** Research only — **DO NOT IMPLEMENT** in Production Beta

---

## Current State

| Capability | Status |
|------------|--------|
| VNINDEX, VN30, HNX, UPCOM indices | Live via TCBS public API |
| HOSE/HNX/UPCoM heatmap | 19 stocks via TCBS; mock seeds for remainder |
| VN100 coverage | Partial (top-cap only) |
| Real-time streaming | Not implemented |
| Historical charts | Not implemented |

**Active adapter:** `lib/adapters/vietnam/tcbs-adapter.ts` (priority 1)  
**Stubs:** Vietstock, FireAnt (require API keys)

---

## Target Indices & Exchanges

| Symbol | Exchange | Description | Priority |
|--------|----------|-------------|----------|
| VNINDEX | HOSE | Main Vietnam index | P0 — Live |
| VN30 | HOSE | Top 30 large-cap | P0 — Live |
| VN100 | HOSE | Top 100 (future) | P1 |
| HNX | HNX | Hanoi exchange index | P0 — Live |
| UPCOM | UPCoM | Unlisted public company market | P0 — Live |

---

## Data Provider Stages

### Stage 1 — TCBS Public API (Current)

- **Endpoint:** `apipubaws.tcbs.com.vn`
- **Coverage:** 4 indices + ~19 stocks
- **Cost:** Free, no API key
- **Limitations:** No WebSocket, rate limits unknown, no full VN100

### Stage 2 — TCBS Authenticated / SSI Open API

- **Provider:** TCBS partner API or SSI iBoard API
- **Coverage:** Full HOSE/HNX/UPCoM listings, order book depth
- **Requirements:** Business partnership, API key, compliance review
- **Timeline:** Q3–Q4 2026 (estimate)

### Stage 3 — FireAnt Integration

- **Adapter stub:** `lib/adapters/vietnam/fireant-adapter.ts`
- **Coverage:** Comprehensive VN market data, fundamentals
- **Requirements:** `FIREANT_API_KEY`, licensing agreement
- **Use case:** Enhanced heatmap, sector analysis, VN100

### Stage 4 — Vietstock Data Feed

- **Adapter stub:** `lib/adapters/vietnam/vietstock-adapter.ts`
- **Coverage:** Real-time quotes, historical OHLCV
- **Requirements:** `VIETSTOCK_API_KEY` + `VIETSTOCK_API_URL`
- **Use case:** Symbol detail pages, charting

### Stage 5 — Direct Exchange / Regulatory Feed

- **Source:** HOSE/HNX official data or SSC licensed distributor
- **Coverage:** Authoritative, compliance-grade
- **Requirements:** Regulatory approval, significant cost
- **Timeline:** 2027+ (long-term)

---

## Architecture Design (Future)

```
┌─────────────────────────────────────────────────┐
│                  Client (SWR)                    │
│         /api/vietnam-markets                     │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│           vietnam-market-provider.ts           │
│     normalize → merge → cache (60s)             │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│              Adapter Registry                    │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐         │
│  │  TCBS   │ │ FireAnt  │ │Vietstock │         │
│  │  (P1)   │ │  (P2)    │ │  (P3)    │         │
│  └─────────┘ └──────────┘ └──────────┘         │
└─────────────────────────────────────────────────┘
```

### Normalization Layer (Existing)

- `lib/adapters/vietnam/normalize.ts` — maps raw API → `NormalizedVietnamMarket`
- `lib/adapters/vietnam/registry.ts` — priority chain with graceful fallback
- `lib/vietnam-heatmap-seeds.ts` — static seeds for mock/fill gaps

### Planned Enhancements

1. **VN100 index** — Add VN100 ticker to TCBS index list; expand stock universe
2. **Sector grouping** — Map stocks to GICS/ICB sectors for heatmap tabs
3. **Market hours** — Detect HOSE/HNX trading sessions; show "market closed" state
4. **Shared cache** — Redis for cross-instance quote consistency
5. **WebSocket layer** — Optional real-time push for ticker bar (Stage 3+)

---

## Heatmap Expansion Plan

| Phase | Stocks | Exchanges | Source |
|-------|--------|-----------|--------|
| Beta (now) | 19 | HOSE/HNX/UPCoM | TCBS + seeds |
| v0.3 | 50 | All 3 | TCBS expanded list |
| v0.4 | 100 | HOSE focus | FireAnt or Vietstock |
| v1.0 | Full listings | All | Licensed feed |

---

## Compliance Considerations

- Vietnam securities data may require licensing for commercial redistribution
- Display disclaimers (already present in `risk-warning.tsx`)
- No investment advice; illustrative data only
- Partner disclosure for broker/platform content

---

## Dependencies on Other Features

| Feature | Depends on Vietnam data |
|---------|----------------------|
| Ticker bar VN quotes | Stage 1 ✅ |
| Vietnam heatmap | Stage 1 ✅ (partial) |
| Symbol detail pages | Stage 3+ (disabled) |
| Watchlist VN symbols | Stage 2+ (disabled) |
| Market breadth / top movers | Stage 2+ (removed) |

---

## Recommended Next Steps (Post-Beta)

1. Monitor TCBS uptime via `/api/health`
2. Evaluate FireAnt trial API for VN100 coverage
3. Implement market-hours detection (no code now)
4. Design VN100 seed file structure
5. Legal review for data licensing before Stage 3
