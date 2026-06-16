# SEO Audit — BTrading Market Insights

**Date:** 2026-06-16  
**Site:** https://btrading.org

---

## Summary

| Check | Status | Action |
|-------|--------|--------|
| robots.txt | ✅ Pass | Fixed sitemap URL to use `SITE_URL` |
| sitemap.xml | ✅ Pass | Stable routes only |
| Root metadata | ✅ Pass | OG, Twitter, canonical |
| Page metadata (home, brokers, contact) | ✅ Pass | Via `lib/seo.ts` |
| Legal page metadata | ✅ Fixed | Added `generateMetadata` |
| Canonical URLs | ✅ Pass | `metadataBase` + `alternates.canonical` |
| OG images | ✅ Pass | `/brand/logo.png` |
| Twitter cards | ✅ Pass | `summary_large_image` |
| `/api/*` blocked | ✅ Pass | `disallow: /api/` |
| `/markets/*` excluded | ✅ Pass | Feature flag off |

---

## robots.txt (`app/robots.ts`)

```
User-agent: *
Allow: /
Disallow: /api/
Host: btrading.org
Sitemap: {SITE_URL}/sitemap.xml
```

**Fix applied:** Sitemap URL now uses `SITE_URL` from env instead of hardcoded `https://btrading.org`.

---

## sitemap.xml (`app/sitemap.ts`)

| URL | Priority | Change Freq |
|-----|----------|-------------|
| `/` | 1.0 | hourly |
| `/brokers` | 0.8 | weekly |
| `/contact` | 0.6 | monthly |
| `/legal/terms` | 0.4 | yearly |
| `/legal/privacy` | 0.4 | yearly |
| `/legal/cookies` | 0.4 | yearly |
| `/legal/risk-disclosure` | 0.4 | yearly |
| `/legal/disclaimer` | 0.4 | yearly |
| `/legal/partner-disclosure` | 0.4 | yearly |

**Excluded:** `/markets/*`, `/platforms`, `/api/*`

---

## Metadata Coverage

| Page | Title | Description | Canonical | OG | Twitter |
|------|-------|-------------|-----------|----|---------|
| `/` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/brokers` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/contact` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/legal/*` | ✅ Fixed | ✅ Fixed | ✅ Fixed | ✅ | ✅ |

---

## Root Layout (`app/layout.tsx`)

- `metadataBase`: from `SITE_URL`
- `robots`: index/follow
- `openGraph.siteName`: BTrading Market Insights
- `twitter.card`: summary_large_image

---

## Gaps (Not Fixed — Post-Beta)

| Gap | Severity | Recommendation |
|-----|----------|----------------|
| No hreflang for VI/EN | Medium | Add `alternates.languages` when i18n routing added |
| No JSON-LD structured data | Low | Add `WebSite` + `Organization` schema |
| No web manifest | Low | Add `manifest.json` for PWA hints |
| Legal pages English-only metadata | Low | Acceptable; content is bilingual in UI |
| Package name `my-project` | Low | Rename in `package.json` for ops clarity |

---

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL for sitemap/metadata |

Default: `https://btrading.org` from `lib/brand.ts`

---

## Fixes Applied

1. `app/robots.ts` — sitemap uses `SITE_URL`
2. `app/legal/[slug]/page.tsx` — per-page `generateMetadata`
