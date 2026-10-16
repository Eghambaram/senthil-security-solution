# Assumptions

Decisions made without client input. Each can be reversed.

## Phase 1 — Audit (16 Oct 2026)

1. **Workspace is greenfield.** Only `CLAUDE.md`, `PROMPT.md` and the mockup existed; there is no legacy code to preserve.
2. **Live-site contact details are treated as pending, not verified.** The legacy site lists three mobile numbers whose tel: links dial a fourth number, so none is used until the client confirms.
3. **Street address uses the listings' format** ("No. 2, Railway Station Road, Kamaraj Nagar"), not the legacy site's shorter "2 Station Road".
4. **"Across India" is not claimed.** Service area defaults to Chennai until confirmed.
5. **IT and ATM security** (newly seen on the live site) are added to the pending service list. They are not treated as separate pages yet.

## Phase 2 — Design system (16 Oct 2026)

6. **Next.js 16.4.0, not 15.** CLAUDE.md asks for "15+". Versions are pinned at least a week old to pass pnpm's minimum-release-age supply-chain check; TypeScript is held at 5.9 and ESLint at 9 because TS 7 / ESLint 10 are too new for Next's tooling.
7. **Real logo is used as-is.** The existing crest is maroon/peach with laurels, unlike the mockup's navy/gold shield. It is shown in the header on white and in a white tile on the navy footer, next to a typeset "SENTHIL / Security Solutions" wordmark. A redrawn SVG and any colour change need client approval.
8. **Every service and industry is `pending`.** Per CLAUDE.md §3, none is confirmed, so production builds show the Services/Industries menus with only their "All …" link. Confirming the core three services (industrial, corporate/commercial, residential) is the most valuable client answer for the homepage.
9. **Hero accent uses gold-ink, not gold-500.** Gold-500 on white is ≈2.3:1, which fails even the 3:1 large-text threshold.
10. **Utility-bar "Enquiry" links to `/contact`**; the header CTA covers `/site-assessment`.
11. **Mobile menu uses a native modal `<dialog>`** for focus containment and Esc handling instead of a custom focus trap.
12. **Added `tailwind-merge`** so component `className` overrides (e.g. `hidden lg:inline-flex` on a Button) win over base classes; the custom type scale is registered with it.
13. **Added `@playwright/test`** early to verify layouts at real 320/375 px viewports via the installed Edge (headless Edge screenshots on Windows cannot go below ~500 px). Full E2E suite remains Phase 6.
