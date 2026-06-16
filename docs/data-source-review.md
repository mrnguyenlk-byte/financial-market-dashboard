# Data Source Review — BTrading Market Insights

**Date:** 2026-06-16

---

## Overview

| Source | Provider | API Route | Fallback | Kill-Switch |
|--------|----------|-----------|----------|-------------|
| CoinGecko | `crypto-provider.ts` | `/api/crypto` | 50-coin mock | `COINGECKO_ENABLED=false` |
| Yahoo Finance | `global-market-provider.ts` | `/api/global-markets` | 7-instrument mock | None |
| Stooq CSV | `global-market-provider.ts` | (chain fallback) | Same mock | None |
| TCBS | `tcbs-adapter.ts` | `/api/vietnam-markets` | Rich VN mock | `TCBS_ADAPTER_ENABLED=false`, `VIETNAM_MARKET_ENABLED=false` |
| RSS (Yahoo/CNBC/MW) | `news-provider.ts` | `/api/news` | Static headlines | `NEWS_RSS_ENABLED=false` |
| Fair Economy | `economic-provider.ts` | `/api/calendar` | 7 mock events | None |
| Trading Economics | `economic-provider.ts` | `/api/calendar` | Fair Economy chain | Requires `TRADING_ECONOMICS_KEY` |

---

## CoinGecko

**Endpoint:** `api.coingecko.com/api/v3/coins/markets`  
**Data:** Top 50 coins by market cap, BTC/ETH/BNB/SOL/XRP tickers, heatmap tiles, Fear & Greed derivation

| Aspect | Assessment |
|--------|------------|
| Reliability | Good; occasional rate limits on free tier |
| Rate limit | ~10–30 req/min (free); mitigated by 60s server cache |
| Auth | None required for public endpoint |
| Fallback | Full mock with realistic prices |
| Future replacement | CoinMarketCap, Binance public API, or paid CoinGecko Pro |

---

## Yahoo Finance + Stooq

**Chain:** Yahoo chart v8 → Yahoo quote v7 → Stooq CSV  
**Instruments:** S&P 500, NASDAQ, DOW, GOLD, WTI OIL, DXY, SILVER

| Aspect | Assessment |
|--------|------------|
| Reliability | Moderate; Yahoo may block/rate-limit server IPs |
| Rate limit | Unofficial; no SLA |
| Auth | None |
| Fallback | Stooq CSV in chain; final mock |
| Future replacement | Twelve Data, Alpha Vantage, or licensed market data feed |

---

## TCBS (Vietnam)

**Endpoint:** `apipubaws.tcbs.com.vn/quote/v1/ticker/{ticker}/overview`  
**Data:** VNINDEX, VN30, HNX, UPCOM indices + 19 HOSE/HNX/UPCoM stocks

| Aspect | Assessment |
|--------|------------|
| Reliability | Good during market hours; public no-key API |
| Rate limit | Unknown; 23 parallel requests per fetch |
| Auth | None (public endpoints) |
| Fallback | Rich mock with HOSE/HNX/UPCoM seed data |
| Future replacement | See `docs/vietnam-market-roadmap.md` |

**Stub adapters (not wired):**
- **Vietstock** — requires `VIETSTOCK_API_KEY` + `VIETSTOCK_API_URL`
- **FireAnt** — requires `FIREANT_API_KEY`

---

## RSS News

**Feeds:** Yahoo Finance, CNBC Markets, MarketWatch Top Stories  
**Parser:** `rss-parser`, max 20 items, deduped by title

| Aspect | Assessment |
|--------|------------|
| Reliability | Good; feeds occasionally restructure |
| Rate limit | Low concern; 3 parallel fetches |
| Auth | None |
| Fallback | Static bilingual mock headlines |
| Future replacement | NewsAPI, Benzinga, or curated editorial CMS |

---

## Economic Calendar

**Primary:** `nfs.faireconomy.media/ff_calendar_thisweek.json`  
**Secondary:** Trading Economics API (optional key)

| Aspect | Assessment |
|--------|------------|
| Reliability | Good for forex/macro events |
| Rate limit | Low |
| Auth | None (Fair Economy); key for Trading Economics |
| Fallback | 7 static bilingual events |
| Future replacement | Investing.com API, Forex Factory scrape (with ToS review) |

---

## Currency Strength (Disabled)

**Provider:** `currency-provider.ts` — returns `null` for live hook  
**Status:** Mock-only; feature flag `currencyStrength: false`

| Future options | Notes |
|----------------|-------|
| OANDA API | Requires account |
| Twelve Data FX | Paid tier |
| ECB reference rates | Free but delayed |

---

## Caching Strategy

| Layer | TTL | Scope |
|-------|-----|-------|
| In-memory provider cache | 60s | Per serverless instance |
| SWR client dedup | 30s | Browser |
| Next fetch revalidate | 60s default | Overridden by `cache: "no-store"` in providers |

**Recommendation:** For production scale, add Redis/Upstash shared cache to reduce upstream load.

---

## Health Monitoring

`/api/health` probes all 5 data services and returns:
```json
{
  "status": "ok" | "degraded",
  "services": { "crypto": { "source", "fallback" }, ... }
}
```

Use for uptime monitoring; no secrets exposed.
