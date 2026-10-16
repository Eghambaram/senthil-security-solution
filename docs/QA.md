# Phase 6 QA report

Date: 16 Oct 2026 · Build: production (`next build`), live-site settings (no review mode) · 16 pages in the sitemap.

All checks except Lighthouse performance are automated in `e2e/qa.spec.ts` and run with `pnpm test:e2e`, so they repeat on every change.

## Summary

| Check | Result |
|---|---|
| Lint, typecheck, unit tests (53), build | ✅ Pass |
| Playwright E2E (desktop 1280 + mobile 375): forms, navigation, redirects, QA suite | ✅ 45 passed (11 skipped: device-specific tests on the other device) |
| Accessibility: axe-core, WCAG 2.2 A/AA, all 16 pages | ✅ 0 violations |
| Lighthouse mobile: Accessibility / Best Practices / SEO | ✅ 100 / 100 / 100 on every page |
| Lighthouse mobile: Performance | ⚠️ Median 77–91 locally (see below); confirm on the deployed site |
| No horizontal scroll at 320 / 375 / 768 / 1024 / 1440 px, all pages | ✅ |
| Keyboard: skip link, visible focus ring on every tab stop (6 key pages, desktop + mobile), dropdowns and mobile menu (Esc returns focus) | ✅ |
| Link crawl: every internal link returns 200, every `#anchor` exists, no `href="#"`, tel/mailto formats, external links open in a new tab with `noopener noreferrer`, external targets not 404 | ✅ |
| Metadata: unique titles (`{Page} \| Senthil Security Solutions, Chennai`) and descriptions (≤ 155), canonical, Open Graph image, `lang="en-IN"`, no stray `noindex` | ✅ |
| Structure: one `h1` and one `main` per page, no skipped heading levels, every image has alt text | ✅ |
| Structured data: JSON-LD parses on every page; BreadcrumbList on every inner page | ✅ |
| robots.txt (allows the site, blocks `/api/` and `/styleguide`, points to the sitemap) and sitemap.xml (16 unique URLs, all 200, no gated pages) | ✅ |
| 404 page returns HTTP 404 | ✅ |
| Legacy URL redirects (301), including `/projects.php → /about#clients` | ✅ |
| Cumulative Layout Shift | ✅ 0 on every page |

## Fixed during QA

1. **No social-share image.** Links shared on WhatsApp, LinkedIn or Facebook showed no preview. Added `public/og-image.jpg` (1200×630, 83 KB) and a `summary_large_image` card for X; built by `scripts/make-brand-assets.mjs`. A static file, not `next/og`, so the Worker does not grow.
2. **46 KB favicon.** `app/icon.png` is now 96×96, 6 KB.
3. **Hero image lacked a high fetch priority**, and the header logo was preloaded ahead of it. The hero now has `fetchpriority="high"`; the logo loads eagerly without a competing preload.
4. **Render-blocking stylesheet** (11 KB, ~280 ms in the lab). CSS is now inlined (`experimental.inlineCss`).

## Lighthouse performance (mobile)

Median of three runs per page, Lighthouse 13, simulated throttling (the PageSpeed Insights method), against `next start` on the development PC:

| Page | Perf | LCP | TBT |
|---|---|---|---|
| / | 77 | 4.2 s | 369 ms |
| /site-assessment | 85 | 3.4 s | 234 ms |
| /services | 84 | 3.7 s | 261 ms |
| /industries | 86 | 3.7 s | 208 ms |
| /about | 79 | 3.9 s | 352 ms |
| /careers | 82 | 3.5 s | 295 ms |
| /contact | 82 | 3.4 s | 301 ms |
| /privacy-policy | 90 | 2.9 s | 258 ms |
| /terms | 91 | 2.9 s | 232 ms |
| /services/industrial-security | 89 | 3.1 s | 260 ms |
| /services/corporate-commercial-security | 90 | 3.0 s | 231 ms |
| /services/residential-security | 84 | 3.2 s | 353 ms |
| /industries/manufacturing-industrial | 90 | 3.1 s | 213 ms |
| /industries/corporate-offices-it-parks | 90 | 3.2 s | 223 ms |
| /industries/commercial-retail | 91 | 3.1 s | 189 ms |
| /industries/residential-communities | 84 | 3.5 s | 321 ms |

**Why these numbers are not final.** The server, the browser and Lighthouse all ran on one Windows PC. Identical runs of the same page varied by up to 16 points, and the *measured* first paint of the homepage swung between 0.33 s and 1.35 s. Lighthouse's simulation also assumes the text waits for all JavaScript when, on localhost, every script finishes before the first paint: the Privacy page's text actually painted at 0.22 s, but was simulated at 2.9 s.

**Phase 7 launch gate:** run PageSpeed Insights (mobile) on the deployed Cloudflare URL for `/`, `/about`, `/contact` and one service page. If any page is below 90, apply in this order:

1. Serve a portrait (4:5) crop of the hero on phones via `<picture>` / `getImageProps` (today phones download the 1920 px landscape image, ~80 KB).
2. Stop prefetching `/site-assessment` from the CTA buttons (`prefetch={false}`): the prefetch pulls in the form libraries (~45 KB) during page load. Trade-off: the first click on the CTA is a little slower.
3. Reduce client-side JavaScript in the header (navigation menus are client components on every page).

## How to re-run

```bash
pnpm test:e2e                                  # all E2E, including e2e/qa.spec.ts
pnpm test:e2e e2e/qa.spec.ts                   # QA suite only
pnpm build && pnpm exec next start -p 3302     # then, in another terminal:
pnpm exec lighthouse http://localhost:3302/ --only-categories=performance,accessibility,best-practices,seo --view
```
