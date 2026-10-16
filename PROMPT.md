# PROMPT.md — Build Brief: Senthil Security Solutions Website Redesign

> Paste this whole file as the opening instruction to Claude (with `CLAUDE.md` in the repo root). It supersedes earlier drafts of the master prompt and folds in the October 2026 site audit, the homepage mockup review and the design-reference research.

---

## 0. Your role

Act as a senior product designer, brand strategist, Next.js architect, conversion specialist and full-stack engineer working as one team. Build the **actual, working website** — not a description, not a static mockup.

Read `CLAUDE.md` first. Its rules (no invented facts, gated armed-services content, contrast rules, form contract) override anything in this brief.

---

## 1. Outcome

A premium, fast, accessible Next.js website for **Senthil Security Solutions**, a manned-guarding company in Tambaram Sanatorium, Chennai, established 26 May 2012. It must:

1. Make a factory owner, facilities head or apartment-association secretary trust the company within 10 seconds.
2. Turn that trust into a **site-assessment enquiry** or **phone call** (primary KPIs).
3. Recruit security personnel, including ex-servicemen (secondary KPI).
4. Replace the legacy PHP/WordPress site with clean URLs, real content and 301 redirects.

---

## 2. Audit summary (done 16 Oct 2026 — re-verify before launch)

**Legacy site**
- Pages: Home, About Us, The Team, Service, Clients, Contact Us (`*.php`).
- Body content is not readable as text (image-based / script-rendered) → poor SEO and accessibility.
- Terms & Conditions modal contains lorem ipsum; copyright reads 2022; built by Malaris Software Solutions.
- Contact page embeds Google Maps at 12.937477, 80.1287727.

**Facts found in public listings** (full register with status in `CLAUDE.md` §3)
- Address: No. 2, Railway Station Road, Kamaraj Nagar, Tambaram Sanatorium, Chennai 600047.
- Phone: +91 44 4380 6837. Hours listed Mon–Sat 9 AM–7 PM.
- Self-reported: ~500 guards / armed guards / ex-servicemen; staff drawn from CISF, Air Force, Navy, Army; two managers from CISF/Air Force.
- Training listed: security systems, fire prevention & firefighting, first aid, bomb-threat response, crime detection.
- Services listed: industrial/factory, commercial, residential, personal bodyguards, event, religious facilities, armed guards.

**Blocking gaps** → email, PSARA licence, arms-licence status, legal entity type (conflict between "Companies Act" claim and GSTIN), confirmed personnel number, client permissions, authentic photography. Build everything else; gate these.

---

## 3. Review of the supplied homepage mockup

The mockup sets the right direction — navy/white/gold, split hero, editorial about section, restrained cards. Keep its structure. Fix these issues in the build:

| # | Mockup issue | Fix |
|---|---|---|
| 1 | "Client Login" in utility bar — no client portal exists | Remove. Utility bar: positioning · location · phone · Careers · Enquiry |
| 2 | AI-style photos show "SENTHIL" printed on uniforms and caps | Do not ship generated images implying real staff/uniforms. Use client photos or unbranded imagery (`images.ts` → `isAuthentic`) |
| 3 | "500+ Security Personnel*" counter | Render only if client confirms; footnote must carry a date ("as of Oct 2026"). Else swap for "Ex-forces leadership" qualitative indicator |
| 4 | "Armed & Ex-Servicemen" service card | Gated on PSARA + arms-licence confirmation. Fallback 4th card: "Event & Personal Security" (if confirmed) |
| 5 | Gold "Know More" text links on white (≈2.3:1 contrast) | Use `gold-ink #8A6316` for text; label "Explore service" per brief |
| 6 | Sub-heading reads "Customized security solutions…" | Use approved copy: "Professional security solutions tailored to the needs of your premises, people and operations." |
| 7 | Hero copy says "security personnel" vs brief's "security solutions" | Use "security solutions" (matches positioning) |
| 8 | Why-Choose-Us tiles are equal-weight boxes, slightly template-like | Use 3×2 grid with hairline separators instead of boxed cards; icon + 1-line title + 1-line support |
| 9 | Process, Industries, FAQ, Final CTA, Footer not shown | Build per §6 |
| 10 | Monitoring-desk photo in About collage implies a control room | Use only if the company actually runs one; otherwise a supervisor briefing / site-patrol image |

---

## 4. Design references & moodboard

Pinterest pins can't be scraped reliably, so the moodboard is defined by search terms plus named live references. Before Phase 2, collect 15–20 pins into a board titled **"SSS — Enterprise Guarding"** using these searches, then extract only the patterns below (never copy layouts or assets).

**Pinterest / Dribbble / Behance searches**
- `security company website ui navy gold`
- `corporate security services landing page`
- `facility management website editorial`
- `industrial company website hero split layout`
- `B2B services website trust indicators`
- `minimal corporate website dark navy`
- `process steps section web design`
- `careers page recruitment ui`

**Live enterprise references (benchmark polish, not copy)**
- GardaWorld, Securitas, Allied Universal — clear service taxonomy by sector, sober photography, strong "talk to us" CTAs.
- SIS India, Checkmate Services — Indian context: ex-forces credibility, PSARA/ISO disclosure in footer, careers prominence.
- ADT, Brinks Home — conversion clarity: one primary CTA per view, phone always reachable.

**Patterns to adopt**
1. **Editorial split hero**: 5/7 column split, headline left, full-bleed photo right bleeding to viewport edge; floating trust panel overlapping the photo's bottom-left.
2. **Thin gold rule + eyebrow** before every section heading (24×2px rule, uppercase 12px label).
3. **Photo-topped service cards** with icon tab overlapping image edge (as in mockup), 12px max radius, 1px border, lift 4px on hover.
4. **Dark navy band** with low-opacity (≤ 20%) duotone photo for the consultation banner.
5. **Numbered process rail**: large outlined numerals (01–04) connected by a 1px line; becomes vertical on mobile.
6. **Sector mosaic** for Industries: asymmetric 2-large + 4-small image grid, captions on a navy gradient scrim.
7. **Compliance strip** in footer (PSARA no., GSTIN) — once verified; this is a strong trust signal in Indian B2B.
8. **Sticky mobile action bar**: Call · WhatsApp · Enquire (56px tall, safe-area aware, hides on scroll-down, shows on scroll-up).

**Patterns to avoid**: glassmorphism, neon cyber aesthetics, padlock/shield clip-art collages, rounded-2xl pill cards, gradient text, auto-playing carousels, cursor effects, dark-mode-only sites, stock photos of SWAT/firearms.

**Photo art direction**: natural daylight, eye-level or slightly low angle, real Chennai context (gated communities, factory gates, IT-park lobbies), uniforms neat and unbranded unless authentic, people looking purposeful, not posing at camera with crossed arms. Colour grade: slightly cool shadows, warm highlights to echo navy/gold.

---

## 5. Brand system

- **Positioning line**: "Protection that earns your trust."
- **Support line**: "Professional security solutions built around people, discipline and reliability."
- **Promise**: Helping businesses and communities create safer environments through professional security services and dependable operational support.
- **Voice**: calm, exact, disciplined. Short sentences. Facts over adjectives. Indian English spelling (organisation, centre).
- **Tokens, type scale, grid, breakpoints**: see `CLAUDE.md` §8. Manrope for display, Inter for text.
- **Logo**: rebuild the existing shield-S mark as SVG from the client's vector original; if only the PNG exists, trace cleanly and get approval. Provide light and dark variants and a 32px favicon.

**Buttons**
- Primary: gold-500 fill, navy-900 text, 48px height, 8px radius, arrow icon nudges 4px on hover.
- Secondary: 1px navy-900 border, transparent; on dark: 1px white/40 border, white text.
- Tertiary: text link in gold-ink (light) / gold-300 (dark) with animated underline.

---

## 6. Homepage — section spec

All copy below is approved unless it depends on a `NEEDS CONFIRMATION` fact (marked ⚑).

**A. Utility bar** (navy-900, 40px, hidden < 768px except phone)
`Professional Security Services · Chennai, Tamil Nadu` | `☎ +91 44 4380 6837` | `Careers` | `Enquiry`

**B. Header** (white, 76px, sticky; shrinks to 64px + shadow after 24px scroll)
Logo · Home · About · Services ▾ · Industries ▾ · Careers · Contact · **[Request a Site Assessment →]**
Dropdowns: hover-intent + click, `aria-expanded`, Esc closes, arrow-key navigation. Active page: 2px gold underline. Mobile: hamburger → full-height sheet, focus-trapped, body scroll-locked, links 48px tall, CTA pinned at bottom.

**C. Hero**
- Eyebrow: PEOPLE. PROCESS. PROTECTION.
- H1: Protection that earns *your trust.* (the last two words in gold-500 on light bg are allowed because display size ≥ 48px counts as large text, ≥ 3:1 — check actual ratio; if it fails, use gold-ink)
- Body: Professional security solutions for industrial, commercial and residential environments—built around discipline, vigilance and people.
- CTAs: **Discuss Your Security Needs** (→ /site-assessment) · Explore Our Services (→ #services)
- Trust row: `Since 2012` · ⚑ `500+ personnel (as of …)` or `Ex-forces leadership` ⚑ · `Trained & disciplined teams`
- Floating panel: shield icon · "Security, delivered with discipline" · "Trained teams, clear reporting and a single point of contact for your site."
- Motion: headline lines reveal (y 16 → 0, stagger 80ms); image scale 1.04 → 1 over 900ms; panel fades in 300ms later.
- Mobile: image first (4:5 crop, focal point on face), text below; trust row wraps to 2×2.

**D. Services** — eyebrow OUR SERVICES · H2 "Security for every environment." · sub as above
Cards: Industrial Security · Corporate & Commercial Security · Residential Security · fourth card ⚑ (Armed & Ex-Servicemen if licensed, else Event & Personal Security if confirmed, else 3-card layout with a "Not sure what you need? Talk to us" tile). Grid: 4 → 2 → 1 (horizontal snap-scroll on mobile is acceptable if peeking card visible).

**E. Consultation banner** — "Let's build a safer workplace." · "Talk to our team about a security plan tailored to your premises." · **Request a Consultation**

**F. About** — eyebrow ABOUT SENTHIL SECURITY SOLUTIONS · H2 "A safer tomorrow, built on discipline and service."
Body: "Since 2012, Senthil Security Solutions has provided trained security personnel to factories, offices and residential communities across Chennai. Our teams are built on the discipline of people who have served in India's armed and disciplined forces ⚑, and on a simple commitment: show up, stay vigilant and keep you informed."
Indicators: Experienced management ⚑ · Trained personnel ⚑ · Client-focused approach. CTA: Know More About Us.

**G. Industries** — eyebrow INDUSTRIES WE SERVE · H2 "Wherever people work and live."
Tiles: Manufacturing & Industrial · Corporate Offices & IT Parks · Commercial Buildings & Retail · Residential Communities · Warehouses & Logistics · Events & Religious Venues ⚑. Each links to `/industries/[slug]`.

**H. Why choose us** — H2 "More than security. A long-term partner."
1 Trained, disciplined personnel · 2 Plans built around your site · 3 Safety and discipline first · 4 Experience across sectors · 5 Responsive communication · 6 Long-term relationships. One-line support each; no superlatives.

**I. Our approach** (confirm with client it reflects real practice ⚑)
01 Understand your site → 02 Assess risks and operations → 03 Recommend a deployment plan → 04 Deploy, supervise and review.

**J. Testimonials** — omit until written, attributable testimonials exist. Replace with a **"Company at a glance"** fact strip: Established 2012 · Based in Tambaram, Chennai · Open Mon–Sat ⚑ · PSARA licensed ⚑.

**K. FAQ** (accordion, `FAQPage` JSON-LD) — 6 questions from the brief; answers from verified facts only. Example: *Which areas do you serve?* → "We are based in Tambaram Sanatorium and serve sites across Chennai ⚑ [expand once service area is confirmed]."

**L. Final CTA** — "Your premises deserve dependable protection." · "Tell us about your security requirements and let our team help you identify the next steps." · **Request a Site Assessment** · Call Our Team (`tel:`)

**M. Footer** (navy-900) — logo + 2-line description · Quick links · Services · Industries · Contact (address, phone, email ⚑, hours ⚑) · map link · social (Facebook ✓, others ⚑) · compliance strip ⚑ · Privacy · Terms · © {currentYear} Senthil Security Solutions.

**Floating contact actions** — desktop: small "Call" + "WhatsApp ⚑" stack bottom-right; mobile: sticky action bar (§4 pattern 8). Must never cover form submit buttons (hide when a form is in viewport).

---

## 7. Inner pages

Each service page follows: Breadcrumbs → hero (service-specific image) → what it is → typical requirements → capabilities → benefits → suitable facilities → how enquiry works → FAQs (4–6, unique) → related services → CTA. **Write unique copy for each**; the outlines below are starting points.

| Route | Focus of unique content |
|---|---|
| `/services/industrial-security` | Gate & material movement control, vehicle/visitor logs, shift handovers, fire-watch rounds, contractor labour checks, night patrols |
| `/services/corporate-commercial-security` | Reception/lobby security, access-card discipline, visitor management, after-hours patrols, mall/IT-park floor coverage, courteous front-of-house conduct |
| `/services/residential-security` | Gate control for apartments/gated communities, visitor & delivery logs, staff/domestic-help registers, night rounds, coordination with associations |
| `/services/event-security` ⚑ | Crowd flow, entry screening, VIP movement, temporary deployment planning |
| `/services/armed-ex-servicemen` ⚑ gated | Only after licence confirmation; licence numbers on page |
| `/industries/[slug]` | Sector pain points → which services apply → link to service pages |
| `/about` | Story since 2012, approach, training ⚑, leadership ⚑, values (Discipline · Vigilance · Integrity · Respect), credentials ⚑, CTA |
| `/careers` | Why work here, roles, eligibility (age, education, physical fitness ⚑), what training covers ⚑, ex-servicemen welcome ⚑, application form, privacy note |
| `/gallery` | Only authentic, approved photos; masonry grid; lightbox with keyboard support. If none at launch, omit from nav and sitemap |
| `/contact` | Address, map (lazy-loaded click-to-load iframe for performance/privacy), phone, email ⚑, hours ⚑, short enquiry form |
| `/site-assessment` | Full enquiry form (CLAUDE.md §10), "what happens next" 3-step note, response-time promise ⚑ |
| `/privacy-policy`, `/terms` | Real, plain-language text covering DPDP Act 2023 notice, purpose, retention, grievance contact. Mark "Draft — legal review required" in docs, not on the page |

---

## 8. Functional build

Follow `CLAUDE.md` §5 and §10 exactly: shared zod schemas, Turnstile + honeypot + rate limit, Postgres via Drizzle, Resend notifications, private resume storage with signed URLs, honest error states. Add 301 redirects from legacy `.php` URLs (`CLAUDE.md` §11). CMS (Payload) only if the client confirms they will edit content.

---

## 9. Phases & deliverables

| Phase | Work | Exit criteria |
|---|---|---|
| 1 Audit | Re-check live site & listings; finalise `content/company.ts`; write `docs/CONTENT-GAPS.md` with §4 questions from CLAUDE.md | Facts register reviewed |
| 2 Design system | Tokens, fonts, Button/Container/SectionHeading/Eyebrow/Reveal, Header/Footer, a `/styleguide` dev-only route | Styleguide renders all components at all breakpoints |
| 3 Homepage | Sections A–M + floating actions | Lighthouse mobile ≥ 90/95/95/95, axe clean |
| 4 Inner pages | All routes in §7 with unique copy | No duplicate paragraphs across service pages (run a quick similarity check) |
| 5 Functionality | Forms, DB, email, uploads, spam, rate limits, redirects | E2E tests pass for success **and** failure paths |
| 6 QA | Build, lint, typecheck, Playwright at 320/768/1024/1440, keyboard pass, metadata/sitemap/robots check, link crawl | Zero errors, zero dead links |
| 7 Deploy | Vercel project, env vars, DNS cut-over plan, `docs/DEPLOYMENT.md` | Production URL live with redirects verified |

At the end of every phase: summarise what shipped, list remaining ⚑ items, commit.

---

## 10. Final deliverables

1. Working Next.js repo (structure per `CLAUDE.md` §7).
2. `README.md` — install, dev, build, start.
3. `.env.example` — every variable, no secrets.
4. `docs/DEPLOYMENT.md` — Vercel setup, DB provisioning + migrations, Resend domain verification (SPF/DKIM), Turnstile keys, DNS records, legacy-URL redirect checklist, rollback plan.
5. `docs/CONTENT-GAPS.md` — every unresolved ⚑ with owner and impact.
6. `docs/ASSUMPTIONS.md` — design and technical decisions made without client input.

---

## 11. Definition of done

Everything in `CLAUDE.md` §12 for every page, plus: forms deliver real emails and DB rows; failure paths tested; no unverified claim is visible in production; legacy URLs redirect; the site feels like an established, premium security partner — not a template.

**Start now with Phase 1.** Inspect the current project folder first; preserve useful existing code.
