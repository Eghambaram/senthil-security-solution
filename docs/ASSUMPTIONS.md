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

## Phase 4 — Inner pages (16 Oct 2026)

24. **Pending pages 404 in production.** Service and industry detail pages use `generateStaticParams` + `dynamicParams = false` over *visible* items, so in production (all pending) `/services/*` and `/industries/*` return 404 and are left out of `sitemap.xml`. The `/services` and `/industries` index pages still exist and fall back to a "Tell us about your premises" prompt.
25. **Service and industry copy was written by us** from the outlines in PROMPT.md §7, avoiding numbers, certifications and claims we cannot verify. It is unique per page (enforced by `tests/content-uniqueness.test.ts`: no shared paragraph/bullet/FAQ, and < 15 % 3-word-shingle overlap between any two pages). The client must review it before services are switched to `verified`.
26. **"How an enquiry works" (visit → written proposal)** is shared across service pages and the site-assessment page. It describes a normal sales process; the client should confirm it matches practice.
27. **About page has no leadership section** (no confirmed names/titles). `/company.php` should therefore redirect to `/about`, not `/about#leadership` (Phase 5). Company details show only verified facts (founding date, address, phone); GSTIN is pending; entity type and PSARA are hidden.
28. **Careers eligibility (age, education, fitness) is omitted** — no facts available. "Training" and "PF/ESI" cards and the ex-servicemen panel are pending; the Gunman role is hidden from the form until arms licensing is confirmed.
29. **No response-time promise** on `/site-assessment` (PROMPT.md §7 ⚑) — nothing confirmed.
30. **Gallery is not built.** No authentic, approved photos exist; per PROMPT.md §7 it is omitted from nav and sitemap.
31. **Contact form is a short variant** (name, phone, email, message, consent) of the same zod discriminated union as the full site-assessment form, so both share one endpoint and one server-side schema.
32. **Experience is a range select**, not a free number, for consistent data; **forces branch** is required only when "served" is Yes.
33. **Forms post to `/api/enquiry` and `/api/careers`, which are built in Phase 5.** Until then a submission shows the honest error state with the phone number (verified in the browser: no success panel, input kept). Success is shown only for a 2xx `{ ok: true, reference }` response.
34. **Map is click-to-load** (no Google request until the visitor asks), with a note that Google may set cookies.
35. **Privacy policy and terms are plain-language drafts** covering the DPDP Act 2023 (notice, purpose, consent, retention 12/6 months, rights, grievance route, Data Protection Board). The grievance contact is phone + postal address because no monitored email is confirmed. **Legal review required before launch.**
36. **Performance tuning deferred to Phase 6 on a deployed preview.** Local Lighthouse varies by more than 20 points between consecutive runs of the same page on this machine (benchmark index ≈ 850, another dev server running), so it cannot validate small changes. Known lever: the shared forms chunk (react-hook-form + zod v4, ~143 KiB uncompressed) is prefetched from header links; `zod/mini` would shrink it. A `next/dynamic` split was tried and reverted because it did not reduce what was downloaded.

## Phase 5 — Functionality (16 Oct 2026)

37. **Free hosting stack (approved by project owner):** Cloudflare Workers via OpenNext (hosting), Neon Postgres (database), Cloudflare R2 (CVs), Cloudflare Turnstile (spam), Resend (email). Vercel Hobby forbids commercial use; Supabase free pauses after a week idle; Upstash replaced by a Postgres `submission_attempts` table. CLAUDE.md §5/§6/§13 updated. Worker size measured at **1.43 MiB gzip** (limit 3 MiB on the free plan).
38. **OpenNext 1.20.8** (not the latest 1.20.12): newer versions require Next ≥ 16.4.1, which is under a week old. `pnpm cf:build` must run on Linux (Cloudflare Workers Builds / CI) or Windows with Developer Mode — the adapter creates symlinks.
39. **Allowed install scripts:** `esbuild` and `workerd` (wrangler's bundler and local runtime) in `pnpm-workspace.yaml`.
40. **Email via Resend REST API, plain escaped HTML templates** — no `resend` SDK / React Email, to keep the Worker small. All user input is HTML-escaped (tested).
41. **Success requires both the database write and the email.** If the email fails after the row is saved, the visitor gets an error asking them to call (HTTP 502) and the row is flagged `notify_error`; a retry may create a duplicate, which is preferable to a silently missed enquiry. No auto-reply is sent to visitors (saves the 100/day Resend cap).
42. **Bots are rejected, not fooled:** a filled honeypot or a submission under 3 s returns an error, never a fake success.
43. **Rate limiting counts every attempt** (including failed Turnstile checks), 5 per 10 min per salted-SHA-256 IP per form. Raw IPs are never stored.
44. **CVs:** type confirmed from magic bytes (PDF / OLE2 DOC / ZIP+`word/` DOCX) and must match the extension; stored at `resumes/YYYY-MM/<reference>-<random>.<ext>` in a private R2 bucket; the careers email carries a presigned link valid 7 days (SigV4 maximum). If the DB write fails, the uploaded file is deleted.
45. **Retention job** `POST /api/cron/retention` (Bearer `CRON_SECRET`) deletes enquiries > 12 months, applications + CVs > 6 months and rate-limit rows > 24 h. Scheduling is part of Phase 7.
46. **Legacy redirects** (301): `/company.php → /about` and `/projects.php → /industries` because there is no leadership section or client list.
47. **Fake backends** (memory store, console outbox, memory files, Turnstile skipped) are used only when `NODE_ENV !== "production"` or `E2E_FAKE_BACKENDS=1`; otherwise missing config returns 503 with the phone number.

## Client-approval build — legacy content (16 Oct 2026)

48. **The company's own legacy website and Google Business Profile, supplied by the project owner, are treated as verified sources** for: email, mobile/WhatsApp (+91 90943 31333, confirmed active by the owner), hours (Google: 9–6, Sunday closed — replaces Sulekha's 9–7), Managing Director, personnel background, management background, training topics, background verification, PF/ESI, and the service list. The client confirms them at the approval review.
49. **Not taken from the legacy text:** superlatives ("one of the leading", "prominent", "global entity", "benchmarks for the industry"); the "Companies Act 1956" entity claim (conflicts with the GSTIN); "armed guards" (regulated, unlicensed); "all over India" coverage; C-TPAT, CCTV monitoring and bomb-type lists (not services we can verify the company sells). The legacy programme was rewritten in plain English as on-site procedures, not copied.
50. **"500+" personnel is shown** with the footnote "Company-reported figure, as of October 2026", because it is the company's own published figure; a third-party estimate (185) is logged for reconfirmation.
51. **Only the confirmed WhatsApp number is shown.** The legacy site's other mobiles (+91 90940 25252, +91 95511 25252) are held back until the client says they are in use.
52. **Client review mode** (`NEXT_PUBLIC_REVIEW_MODE=1`): a production build that shows pending content with yellow badges and photo-brief labels, is `noindex` + `robots.txt Disallow: /`, and lets forms run on in-memory stand-ins. A preview submission shows "Preview: the form works … not sent" with a reference — never the normal "we have your enquiry" message — so the client is not misled. The live site must be built without this flag.
53. **Success panel is honest about stand-ins everywhere**: any submission handled by the in-memory store or console outbox (dev, E2E, review) returns `demo: true` and shows the preview message.
