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

## Phase 3 — Homepage (16 Oct 2026)

14. **Neutral navy placeholder frames instead of photos** (agreed with the project owner). Every image slot is listed in `content/images.ts` with a shot brief; a slot renders a real photo only when `src` is set and `approved: true`. In development each frame shows a yellow "Photo pending: …" label; in production it is a plain, decorative navy panel (`aria-hidden`).
15. **Mobile hero crop.** With a placeholder the mobile hero frame is 16:10 instead of the specified 4:5, so a large empty block does not push the headline below the fold. It switches to 4:5 automatically once an approved photo exists.
16. **Sections that depend on pending facts disappear in production** rather than render empty: Services grid (all services pending), Industries mosaic (all sectors pending), Our approach (practice not confirmed). The hero's "Explore Our Services" button is dropped when the Services section is hidden, so it never points at a missing anchor.
17. **Hero trust row.** Production shows Established 2012 · Trained & disciplined · Based in Tambaram, Chennai. "500+ security personnel" (with dated footnote) is pending; "Ex-forces leadership" is not shown separately because it depends on the same unconfirmed background facts.
18. **About body copy has two versions.** The ex-forces sentence (PROMPT.md §6F ⚑) only renders when confirmed; otherwise the approved commitment line is used alone.
19. **Why-choose-us support lines and the approach steps were written by us** (PROMPT.md gave titles only). They avoid superlatives and unverified specifics, but the client should review them.
20. **FAQ.** Six visible questions in development; production shows only the two backed by verified facts (how to request an assessment; when the company was established). The PSARA question is `missing` and never renders.
21. **Removed the `motion` library.** It added a ~107 KB chunk solely for scroll reveals. `Reveal` is now markup + one shared `IntersectionObserver` (`RevealObserver`) + CSS transitions, with the same props, reduced-motion support and the CLAUDE.md §9 easing/offset rules. Content stays visible without JavaScript. Re-add `motion` only if a later interaction genuinely needs it.
22. **Hero entrance uses CSS keyframes**, not JS, so it runs before hydration; the headline animates transform only so it counts as painted for LCP.
23. **Lighthouse numbers were measured locally** on a machine with a Lighthouse benchmark index of 851 (below the ~1000+ reference used for the default 4× CPU throttle), so local Performance scores understate a typical mid-range phone. Re-measure on PageSpeed Insights after deployment (Phase 7).
