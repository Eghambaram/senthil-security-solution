# CLAUDE.md — Senthil Security Solutions Website

Project memory for Claude (Claude Code or any agentic session). Read this file fully before writing code. The full build brief lives in `PROMPT.md`; this file holds the rules, facts, conventions and commands that must stay true for the whole project.

---

## 1. Project in one paragraph

Rebuild https://senthilsecuritysolutions.com/ as a premium, enterprise-grade marketing site for a Chennai-based manned-guarding company (est. 2012, Tambaram Sanatorium). The site must win B2B trust (factories, corporates, IT parks, apartment associations), generate site-assessment enquiries, and recruit guards. It replaces a 2022-era PHP/WordPress site whose content is mostly image-based and whose Terms & Conditions modal still contains lorem ipsum.

North star: **looks like GardaWorld / Securitas / SIS India in polish, reads like a local, honest, disciplined Chennai partner.** Never like a ThemeForest security template.

---

## 2. Non-negotiable rules

1. **No invented facts.** Never fabricate certifications, licences, client names/logos, testimonials, awards, statistics, leadership bios, or service capabilities. If a fact is not in §3 with status `VERIFIED`, it does not ship.
2. **`NEEDS CONFIRMATION` facts** may appear in code only behind the `content/` layer with `status: "pending"`; pending items render nothing in production (`NODE_ENV=production`) and render a visible yellow dev badge in development.
3. **No lorem ipsum, no `href="#"`, no dead buttons.** Every link resolves; every CTA does something real.
4. **No AI-generated or stock images presented as company staff.** Stock/AI imagery must not show a "SENTHIL" logo on uniforms, firearms, CCTV control rooms, or equipment the company has not confirmed. Prefer authentic photos supplied by the client; otherwise use neutral, unbranded imagery and label it as illustrative in the image manifest.
5. **Armed security is a regulated claim.** The "Armed Security & Ex-Servicemen" page and card ship only after the client confirms the PSARA licence and arms-licence status (§3). Until then, ex-servicemen personnel may be described only as "personnel with backgrounds in the armed and disciplined forces" if confirmed.
6. **Never show a false success state.** A form shows success only after the server returns 2xx and the email/DB write succeeded.
7. **Secrets live only in env vars.** Never commit `.env*` except `.env.example`.
8. **Gold is an accent, not a text colour on white.** `#D6A33C` on white fails WCAG contrast (~2.3:1). Use `gold-ink` (`#8A6316`) for gold-toned text on light surfaces.
9. **Preserve before replacing.** If existing code exists, inspect it and keep working functionality. Do not delete user files without asking.
10. **Ask only when a missing business fact is essential** (see §4). Otherwise decide, document the assumption in `docs/ASSUMPTIONS.md`, and continue.

---

## 3. Business facts register

Audit date: 16 Oct 2026. Live site pages (`/aboutus.php`, `/service.php`, `/company.php`, `/projects.php`, `/contact_us.php`) expose only navigation as text — body content is image-based or script-rendered, so facts below come from the site's map embed and the company's public listings. **Get written client sign-off on every row before launch.**

| Fact | Value | Source | Status |
|---|---|---|---|
| Legal/brand name | Senthil Security Solutions (short: SSS) | Website, Facebook | VERIFIED |
| Established | 26 May 2012 | Facebook page, Sulekha | VERIFIED (date) |
| Legal entity type | Facebook says "registered as per Companies Act 1956", but the GSTIN's PAN segment indicates a Firm/LLP | Facebook vs Justdial GSTIN | **CONFLICT — ask client; do not print entity type** |
| GSTIN | 33ACDFS1683A1ZJ | Justdial | NEEDS CONFIRMATION (footer only if client approves) |
| Address | No. 2, Railway Station Road, Kamaraj Nagar, Tambaram Sanatorium, Chennai, Tamil Nadu 600047 (near G K Restaurant) | Justdial, Sulekha, Facebook | VERIFIED (confirm exact formatting) |
| Map coordinates | 12.937477, 80.1287727 | Existing site's Google Maps embed | VERIFIED |
| Phone | +91 44 4380 6837 | Facebook, ZoomInfo, mockup | VERIFIED |
| Mobile / WhatsApp number | — | — | **MISSING — ask client** |
| Email | — | — | **MISSING — ask client** (required for enquiry notifications) |
| Office hours | Mon–Sat, 9:00 AM – 7:00 PM | Sulekha | NEEDS CONFIRMATION |
| Contact person | Senthil Raja | Sulekha | NEEDS CONFIRMATION (name/title before any leadership section) |
| Personnel strength | "around 500 Security Guards / Armed Guards / Ex-Servicemen on our rolls" (undated) | Facebook (self-reported) | **NEEDS CONFIRMATION** — third-party estimate says 185 employees; show "500+" only with client confirmation and a dated footnote |
| Personnel background | Recruits from disciplined forces: CISF, Air Force, Navy, Army | Facebook | NEEDS CONFIRMATION |
| Management background | Two managerial staff from CISF / Air Force | Facebook | NEEDS CONFIRMATION |
| Training topics | Security systems, fire prevention & firefighting, first aid, bomb-threat response, crime detection | Sulekha | NEEDS CONFIRMATION |
| Services (listed publicly) | Industrial/factory guarding, commercial, residential, personal bodyguards, event security, religious-facility security, armed guards | Sulekha, Justdial, ZoomInfo | NEEDS CONFIRMATION per service |
| PSARA licence | — | Not found anywhere | **MISSING — ask client** (legally required for private security agencies in India; display licence no. if provided) |
| Arms licences | — | Not found | **MISSING — blocks Armed Security page** |
| Clients | Existing site has a "Clients" page; names not machine-readable | Website nav | **MISSING — need written permission per logo** |
| Ratings | Justdial lists 4.5 from 28 ratings (Oct 2026) | Justdial | Do not display as testimonials; optional "Rated on Justdial" link only with client approval |
| Social | Facebook: facebook.com/ssschennaicity | Facebook | VERIFIED (LinkedIn/Twitter exist per ZoomInfo — need URLs) |
| Logo | `https://senthilsecuritysolutions.com/image/logo-1.png` (raster) | Website | VERIFIED — request vector (SVG/AI) original |
| Previous vendor | Malaris Software Solutions | Website footer | Info only |

Keep this table mirrored in `content/company.ts` with a `status` field per fact.

---

## 4. Open questions for the client (blocking items in bold)

1. **Business email for enquiries and careers.**
2. **PSARA licence number and validity; arms-licence status for armed guards.**
3. **Correct legal entity (Proprietorship / Partnership firm / LLP / Pvt Ltd) and whether to show GSTIN.**
4. Current personnel strength and number of active sites (for any counters).
5. Mobile/WhatsApp business number.
6. Confirmed service list (which of: industrial, corporate/commercial, residential, event, personal protection, religious facilities, armed, ex-servicemen, housekeeping/facility staff?).
7. Areas served beyond Chennai (Chengalpattu, Kanchipuram, Tiruvallur, rest of Tamil Nadu?).
8. Approved client names/logos and any written testimonials with permission.
9. Leadership names, titles, short bios, photos.
10. Authentic photography (guards on site, training, uniforms, office). If none: approval for a half-day photoshoot or for neutral illustrative imagery.
11. Who receives and processes career applications; retention period for applicant data.
12. Hosting/domain access (DNS registrar for senthilsecuritysolutions.com).

---

## 5. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15+ App Router, React 19, TypeScript `strict` | Server Components by default; `"use client"` only for interactivity |
| Styling | Tailwind CSS v4 with design tokens in `app/globals.css` (`@theme`) | No CSS-in-JS |
| Motion | `motion` (Framer Motion) — lazy, `LazyMotion` + `domAnimation` | Respect `prefers-reduced-motion` |
| Icons | `lucide-react` | 1.5px stroke, consistent 20/24px sizes |
| Forms | `react-hook-form` + `zod` (shared schema client + server) | |
| Server | Route Handlers / Server Actions | Validate with the same zod schema |
| Email | Resend (`resend` SDK) + React Email templates | Server-only |
| Spam | Cloudflare Turnstile + honeypot field + min-submit-time check | |
| Rate limit | Upstash Redis `@upstash/ratelimit` (5 req / 10 min / IP per form) | Fallback: in-memory in dev |
| Database | Postgres (Neon or Supabase) via Drizzle ORM | Tables: `enquiries`, `applications` |
| File uploads | Private bucket (Vercel Blob private / Supabase Storage private / S3) | Signed URLs only, never public |
| CMS | **Phase 2 optional:** Payload CMS 3 (embeds in Next.js, same Postgres). Phase 1 ships with typed content files in `content/`. | Add CMS only if client will edit content |
| Hosting | Vercel (region `bom1` Mumbai) | |
| Analytics | Vercel Analytics or Plausible (cookieless) | No third-party ad trackers |

Do not add a CMS, database or library "for appearance". Each dependency needs a reason in the PR/commit message.

---

## 6. Commands

```bash
pnpm install          # install
pnpm dev              # local dev at http://localhost:3000
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest (schemas, utils)
pnpm test:e2e         # playwright (nav, forms, mobile viewport)
pnpm build && pnpm start
pnpm db:generate      # drizzle-kit generate
pnpm db:migrate       # drizzle-kit migrate
```

Before declaring any task done: `pnpm lint && pnpm typecheck && pnpm build` must pass with zero errors.

---

## 7. Folder structure

```
app/
  (site)/
    layout.tsx                 # UtilityBar, Header, Footer, FloatingContactActions
    page.tsx                   # Home
    about/page.tsx
    services/page.tsx
    services/[slug]/page.tsx   # industrial-security, corporate-commercial-security,
                               # residential-security, event-security, armed-ex-servicemen (gated)
    industries/page.tsx
    industries/[slug]/page.tsx
    careers/page.tsx
    gallery/page.tsx
    contact/page.tsx
    site-assessment/page.tsx
    privacy-policy/page.tsx
    terms/page.tsx
  api/
    enquiry/route.ts
    careers/route.ts
  sitemap.ts
  robots.ts
  opengraph-image.tsx
  not-found.tsx
components/
  layout/   UtilityBar, Header, NavigationMenu, MobileNavigation, Footer, FloatingContactActions, Breadcrumbs
  sections/ HeroSection, TrustIndicators, ServicesGrid, ConsultationBanner, AboutFeature,
            IndustriesGrid, WhyChooseUs, ProcessSteps, FAQAccordion, CTASection, ImageFeatureSection
  cards/    ServiceCard, IndustryCard, ValueCard, TestimonialCard
  forms/    EnquiryForm, CareerApplicationForm, FormField, FileDropzone, SubmitButton
  ui/       Button, Container, SectionHeading, Eyebrow, Badge, Icon, Reveal (motion wrapper)
content/
  company.ts        # facts register with status
  services.ts       # unique copy per service
  industries.ts
  faqs.ts
  navigation.ts
  images.ts         # image manifest: src, alt, credit, isAuthentic, approved
lib/
  schemas/ enquiry.ts, career.ts
  email/   send.ts, templates/
  db/      schema.ts, client.ts
  rate-limit.ts
  turnstile.ts
  seo.ts            # buildMetadata(), jsonLd helpers
public/images/      # optimised AVIF/WebP originals
docs/
  ASSUMPTIONS.md
  DEPLOYMENT.md
  CONTENT-GAPS.md
```

Business content lives in `content/`, never hard-coded in JSX.

---

## 8. Design tokens (source of truth)

```css
@theme {
  /* Brand */
  --color-navy-900: #0B1C32;   /* primary navy — utility bar, banners, footer */
  --color-navy-800: #142B45;   /* secondary navy — hover, cards on dark */
  --color-graphite: #202A35;
  --color-gold-500: #D6A33C;   /* CTA fill, rules, icons on dark */
  --color-gold-300: #F2C76A;   /* hover on dark, highlights */
  --color-gold-ink: #8A6316;   /* gold-toned TEXT on light bg (AA) */
  /* Neutrals */
  --color-white: #FFFFFF;
  --color-surface: #F5F7FA;
  --color-ink: #17263A;        /* primary text */
  --color-ink-muted: #647184;  /* secondary text (≈4.9:1 on white) */
  --color-border: #E2E7ED;
  /* Feedback */
  --color-success: #1F7A4D;
  --color-danger: #B42318;
  /* Type */
  --font-display: "Manrope", system-ui, sans-serif;
  --font-sans: "Inter", system-ui, sans-serif;
  /* Radius — restrained */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;           /* max for cards */
  /* Shadow */
  --shadow-card: 0 1px 2px rgb(11 28 50 / .06), 0 8px 24px -12px rgb(11 28 50 / .18);
  --shadow-float: 0 20px 48px -16px rgb(11 28 50 / .28);
}
```

**Contrast cheat-sheet**
- Navy-900 text on gold-500 button: ≈7.5:1 ✅ (gold buttons use navy text, never white)
- Gold-500 on navy-900: ≈7.5:1 ✅
- Gold-500 on white: ≈2.3:1 ❌ — use gold-ink
- Ink-muted on white: ≈4.9:1 ✅

**Type scale (fluid, `clamp`)**
| Token | Mobile → Desktop | Font / weight |
|---|---|---|
| display | 40 → 72px, lh 1.05, tracking -0.02em | Manrope 800 |
| h1 | 34 → 56px | Manrope 800 |
| h2 | 28 → 44px | Manrope 700 |
| h3 | 20 → 24px | Manrope 700 |
| body-lg | 18px, lh 1.6 | Inter 400 |
| body | 16px, lh 1.65 | Inter 400 |
| eyebrow | 12px, uppercase, tracking 0.14em, preceded by 24×2px gold rule | Inter 600 |

**Layout**: container max 1280px, gutters 16px (mobile) / 24px (tablet) / 32px (desktop); 12-col grid; section padding 64px mobile / 112px desktop; 4px spacing base.

**Breakpoints**: 320–767 mobile · 768–1023 tablet · ≥1024 desktop · ≥1440 large.

---

## 9. Coding conventions

- Components: PascalCase files, one component per file, named exports.
- Props typed with `type Props = {...}`; no `any`.
- Images: `next/image` always, explicit `sizes`, `priority` only on the hero image.
- Fonts: `next/font/google` (Manrope, Inter), `display: swap`, subset latin.
- Links: `next/link`; external links get `rel="noopener noreferrer"`.
- Phone links: `tel:+914443806837`. WhatsApp: `https://wa.me/<number>` only once the mobile number is confirmed.
- Motion: wrap in `<Reveal>`; durations 0.4–0.7s, ease `[0.22, 1, 0.36, 1]`, y-offset ≤ 24px; no infinite/decorative loops; no parallax beyond 8%.
- Every interactive element: visible `:focus-visible` ring (2px gold-500 + 2px offset on dark; 2px navy-900 on light).
- Heading order: exactly one `h1` per page; no skipped levels.
- Copy tone: confident, plain English, short sentences. No "best in class", "No.1", "leading", "world-class" unless verified.

---

## 10. Forms — behaviour contract

**Enquiry / Site assessment** fields: fullName*, organisation, phone* (Indian format, +91 optional), email*, serviceRequired* (select from confirmed services), siteLocation*, premisesType* (Factory / Warehouse / Office / IT Park / Commercial building / Residential community / Event / Other), personnelRequired (optional number range), message (≤ 1500 chars), consent* (checkbox), honeypot, turnstileToken.

**Careers** fields: fullName*, phone*, email, preferredRole* (Security Guard / Supervisor / Gunman — gated / Other), experienceYears*, servedInForces (yes/no + branch, optional), location*, resume (optional; PDF/DOC/DOCX; ≤ 5 MB; magic-byte check server-side), consent*.

Flow: client zod validation → disable button + spinner → POST → server zod validation → rate-limit → Turnstile verify → DB insert → Resend notification → 200 → success panel with reference ID. On any failure: keep user input, show inline error summary (`role="alert"`) and the phone number as a fallback. Errors announced via `aria-live="polite"`.

Data protection: applicants' data and files never exposed via public routes; resumes stored private, accessed via short-lived signed URLs; default retention 12 months (enquiries) / 6 months (applications) pending client policy. Privacy policy must reflect India's DPDP Act 2023 obligations (notice, purpose, consent, grievance contact).

---

## 11. SEO

- `buildMetadata()` gives every page a unique title (`{Page} | Senthil Security Solutions, Chennai`) and description (≤ 155 chars).
- Canonical: `https://senthilsecuritysolutions.com{path}`.
- JSON-LD: `SecurityService` / `LocalBusiness` with verified address, phone, geo, openingHours (only once confirmed), `foundingDate: 2012-05-26`, `sameAs` (verified social URLs). `Service` per service page, `FAQPage` where FAQs render, `BreadcrumbList` on inner pages.
- 301 redirects from legacy URLs: `/index.php → /`, `/aboutus.php → /about`, `/company.php → /about#leadership`, `/service.php → /services`, `/projects.php → /about#clients` (or `/industries` if no client list), `/contact_us.php → /contact`.
- Local keywords used naturally: "security services in Chennai", "security guards Tambaram", "factory security Chennai", "apartment security services Chennai". No keyword stuffing; no ranking promises.

---

## 12. Definition of done (per page)

- [ ] Content pulled from `content/`, all facts `VERIFIED`
- [ ] Unique copy (not a title-swapped duplicate)
- [ ] Responsive at 320 / 375 / 768 / 1024 / 1440 with no horizontal scroll
- [ ] Keyboard-navigable; focus visible; axe-core zero serious violations
- [ ] Metadata, canonical, JSON-LD present
- [ ] Images: alt text, correct crop, `sizes`, lazy below fold
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95
- [ ] No placeholder links, text or images
- [ ] `pnpm lint && pnpm typecheck && pnpm build` pass

---

## 13. Environment variables (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=https://senthilsecuritysolutions.com
DATABASE_URL=
RESEND_API_KEY=
ENQUIRY_TO_EMAIL=
ENQUIRY_FROM_EMAIL=noreply@senthilsecuritysolutions.com
CAREERS_TO_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
BLOB_READ_WRITE_TOKEN=
# Payload (phase 2 only)
PAYLOAD_SECRET=
```

---

## 14. Working agreement for Claude

- Work phase by phase as defined in `PROMPT.md` §9; commit at the end of each phase with a clear message.
- After each phase, update `docs/CONTENT-GAPS.md` with anything still pending from §4.
- When unsure whether a claim is verified, leave it out and log it — omission is always safer than fabrication.
- Prefer fewer, better sections over more, thinner ones.
