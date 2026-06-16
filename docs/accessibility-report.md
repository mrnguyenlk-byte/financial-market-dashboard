# Accessibility Report — BTrading Market Insights

**Date:** 2026-06-16  
**Standard:** WCAG 2.1 AA (target)

---

## Summary

| Severity | Found | Fixed | Remaining |
|----------|-------|-------|-----------|
| High | 4 | 3 | 1 |
| Medium | 6 | 0 | 6 |
| Low | 3 | 0 | 3 |

---

## Fixes Applied (Safe)

### 1. Section heading IDs ✅

**Issue:** `aria-labelledby` referenced IDs that didn't exist on `<h2>` elements.  
**Fix:** Added `id` prop to `SectionHeading`; wired on active sections:
- `heatmap-title`, `calendar-title`, `news-title`, `platforms-title`
- `fg-title`, `risk-title` were already correct

### 2. Language switcher label ✅

**Issue:** Dropdown trigger lacked accessible name.  
**Fix:** Added `aria-label={`Language: ${current.label}`}` to trigger button.

---

## Remaining — High

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Heatmap tabs incomplete ARIA | `heatmap.tsx` | Add `role="tabpanel"`, `aria-controls`, roving tabindex — post-beta |

---

## Remaining — Medium

| Issue | Location | Notes |
|-------|----------|-------|
| Fear & Greed gauge `aria-hidden` | `fear-greed.tsx` | Add sr-only text summary of value |
| Impact dots English-only labels | `economic-calendar.tsx` | Localize aria-label |
| Contact form no `<form>` wrapper | `contact-page.tsx` | Wire form semantics when API added |
| Non-functional buttons | header search, news view-all | Disable or wire — WCAG 2.4.11 |
| Calendar mobile headers hidden | `economic-calendar.tsx` | Inline labels present |
| Broker rating stars `aria-hidden` | `broker-highlights.tsx` | Group with accessible name |

---

## Remaining — Low

| Issue | Location | Notes |
|-------|----------|-------|
| Chart `role="img" aria-hidden` | `lightweight-chart.tsx` | Feature disabled |
| No skip-to-main link | `layout.tsx` | Add skip nav post-beta |
| Decorative icons | Various | Already `aria-hidden` ✅ |

---

## Positive Patterns

| Pattern | Status |
|---------|--------|
| `<main>` landmark | ✅ |
| `<nav aria-label="Main navigation">` | ✅ |
| `<aside aria-label="Market sidebar">` | ✅ |
| Theme toggle `aria-label` | ✅ |
| Contact FAB `aria-label` | ✅ |
| Brand logo alt text | ✅ |
| Banner links `aria-label` (i18n) | ✅ |
| Section error boundaries | ✅ Prevents white screen |
| Focus visible on banner links | ✅ `focus-visible:ring-2` |

---

## Banner Accessibility

| Check | Status |
|-------|--------|
| Link to `/brokers` with aria-label | ✅ EN/VI via i18n |
| Link to `/contact` with aria-label | ✅ EN/VI via i18n |
| Text contrast on gradient overlay | ✅ White on dark overlay |
| Keyboard focusable | ✅ Native `<Link>` |
| No blank space if image fails | ✅ Gradient fallback |

---

## Keyboard Navigation

| Component | Tab order | Enter/Space |
|-----------|-----------|-------------|
| Header nav links | ✅ | ✅ |
| Language switcher | ✅ | ✅ (dropdown) |
| Theme toggle | ✅ | ✅ |
| Sidebar banners | ✅ | ✅ |
| Heatmap exchange tabs | ⚠️ Partial | ⚠️ No roving tabindex |
| Footer links | ✅ | ✅ |

---

## Color Contrast

Dark mode and light mode use CSS variables (`--gain`, `--loss`, `--foreground`). Primary text on card backgrounds meets AA in both themes. Warning banner uses `--warn` with sufficient contrast on dark background.

---

## Recommended Post-Beta A11y Backlog

1. Heatmap full tab pattern (ARIA Authoring Practices)
2. Skip-to-main-content link
3. Screen reader summary for Fear & Greed gauge
4. Disable non-functional interactive controls
5. Contact form with proper labels and validation feedback
