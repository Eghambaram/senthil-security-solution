# Content gaps

Open items that block or limit what the site can show. Last updated 16 Oct 2026, after the project owner supplied the company's legacy website content and Google Business Profile details.

Owner: **Client** = Senthil Security Solutions · **Dev** = build team.

## Resolved from the legacy content (16 Oct 2026)

| Item | Now on the site |
|---|---|
| Public email | senthilsolutions.sss@gmail.com (20 Nov 2026; replaced info@): contact page, footer, site assessment, privacy policy, JSON-LD |
| Phone numbers (20 Nov 2026) | Office +91 98842 96146 (main number everywhere); WhatsApp +91 90940 25252 (floating, mobile bar, utility bar, contact, footer); Managing Director +91 90943 31333 (contact, About leadership and company details) |
| Office landmark | Near Sukkubhai Biryani (20 Nov 2026) |
| Careers roles | Lady Security Guard (LSG) and Assistant Security Officer (ASO) added (20 Nov 2026) |
| Office hours | Mon–Sat 9:00 AM – 6:00 PM, Sunday closed (Google Business Profile) |
| Personnel strength | "1000+" in the hero (20 Nov 2026) with footnote "Company-reported figure, as of November 2026"; About: "More than 1,000" |
| Ex-forces background, management (GM and ED from CISF / Air Force) | About, homepage, FAQ, careers |
| Training topics, background verification, PF & ESI | About, careers, FAQ |
| Managing Director | Mr. K. Senthil Raja, with portrait, leadership section `/about#leadership` (legacy `/company.php` redirects there) |
| Confirmed services | Industrial, corporate & commercial (incl. IT sector, ATMs), residential; garment and automobile factories added |
| Gate / front-desk / patrol procedures | "How we work" sections on the three service pages, rewritten from the legacy "Our Programme" |
| Vision | About page, rewritten without superlatives |
| Training photos (24 Nov 2026) | 19 of 30 client photos on `/gallery` (training, drill and inspection, ceremonial duty, lady security guards), the About page and the careers hero |
| Client logos | 15 clients, permission confirmed by the project owner: homepage after "About" and `/about#clients` (legacy `/projects.php` redirects there) |

## Blocking

| # | Item | Owner | Impact if unresolved |
|---|---|---|---|
| 1 | **A Google App Password for senthilsolutions.sss@gmail.com** (turn on 2-Step Verification, then Google Account → Security → App passwords) so the website can send form notifications from the company Gmail (settings pre-filled in `.env.example`: smtp.gmail.com, port 465). Confirm the receiving inbox(es) for enquiries and job applications (default: the same Gmail). Check with `pnpm mail:test`. No third-party email service needed | Client / Dev | Forms return "temporarily unavailable, please call" on the live site; the review preview says "not sent" |
| 2 | PSARA licence number and validity | Client | No compliance strip; no "licensed" claim anywhere |
| 3 | Arms-licence status | Client | Armed & Ex-Servicemen page and card stay hidden; "Gunman" role hidden; "armed guards" never mentioned |
| 4 | Legal entity: legacy site says "Companies Act 1956" but the GSTIN indicates a firm/LLP. Show GSTIN? | Client | Entity type and GSTIN not printed |
| 19 | **Legal review of `/privacy-policy` and `/terms`** (drafts in `content/legal.ts`), including a named grievance officer | Client / lawyer | Must be signed off before launch |

## Important

| # | Item | Owner | Impact if unresolved |
|---|---|---|---|
| 5 | Is the legacy number +91 95511 25252 still in use? (+91 90940 25252 is now the WhatsApp number) | Client | Not shown |
| 6 | Number of active sites (optional, for the "at a glance" section) | Client | Not shown |
| 7 | Still unconfirmed services: event / personal protection, religious venues, warehouses & logistics, housekeeping | Client | Event Security page and the warehouse/event industry pages show only in the review preview |
| 8 | Areas served (legacy site says "Chennai or all over India") | Client | Copy says "based in Tambaram, serving Chennai" only (FAQ answer pending) |
| 11 | Name of the unidentified client logo `5.jpg` (red emblem on blue); written testimonials. Keep the 15 clients' written permissions on file | Client | `5.jpg` not shown; no testimonials |
| 12 | MD to approve the studio portrait; names of the General Manager and Executive Director (optional) | Client | Portrait shown in `/about#leadership`; GM/ED not named |
| 13 | More authentic photography: guards on duty at gates, lobbies and apartment entrances, to replace the remaining illustrative AI/stock images (hero, service and industry cards) | Client | About and careers now use the client's training photos (24 Nov 2026); hero, services and industries still illustrative; armed-security slot still a placeholder |
| 24 | **Licences for the two real stock photos** (event screening, retail entrance) | Client | Replace them with AI/authentic images if the licence cannot be confirmed |
| 14 | Careers data handler and retention period | Client | Default 6 months, stated in privacy policy as provisional |
| 15 | Domain/DNS registrar access | Client | Blocks Phase 7 cut-over |
| 16 | Vector logo (SVG/AI); approval of crest colours (maroon/peach) next to the navy/gold palette | Client | 200 px raster crest used |
| 17 | Confirm the 4-step approach matches real practice | Client | Process section shows only in the review preview |
| 18 | LinkedIn / Twitter URLs | Client | Facebook only in footer |
| 20 | Careers eligibility: minimum age, education, physical fitness, documents required | Client | Eligibility section not shown (careers asks applicants to keep ID and address proof ready) |
| 21 | Response-time commitment for enquiries | Client | No promise shown |
| 22 | Gallery photos: confirm the visitor in the screening photo (DSC_8839, careers hero and gallery) agreed to appear; name the role of the staff in grey shirts (DSC_8858, not used); permission for the hospital barrier photo (DSC_8826, not used: shows a hospital name that is not a listed client) | Client | `/gallery` live with 19 photos (24 Nov 2026) |
| 23 | Google rating (legacy notes "4.1, 9 Google reviews") | Client | Not shown; optional "Rated on Google" link only with approval, never as testimonials |

## Photography shot list

Every image slot is in `content/images.ts`. Illustrative images supplied by the project owner now fill all slots except armed security; these are the authentic shots to replace them with. Rules: authentic photos preferred; no "SENTHIL" branding on stock/AI images; no firearms or control rooms unless real (CLAUDE.md §2.4).

| Slot | Shot |
|---|---|
| hero (4:5 mobile, wide desktop) | Guard at a factory or IT-park gate, daylight, eye level, purposeful not posing |
| serviceIndustrial | Factory gate with vehicle/material check |
| serviceCorporate | Office or IT-park lobby, front-of-house desk |
| serviceResidential | Apartment / gated community gate |
| serviceEvent | Event entry screening, daylight |
| serviceArmed | Only authentic, licensed armed personnel (gated) |
| consultation | Site perimeter or gate at dusk (shown at 20% opacity) |
| aboutPrimary | Supervisor briefing at shift start |
| aboutSecondary | Site patrol round (not a control room) |
| industry × 6 | Factory, office/IT park, commercial building, gated community, warehouse yard, event/religious venue exteriors |

## Copy needing client review

- Why-choose-us support lines and "Our approach" steps (`content/home.ts`).
- FAQ answers (`content/faqs.ts`).
- Service and industry page copy, including the "How we work" procedures (`content/services.ts`, `content/industries.ts`).
- About page story, vision, leadership bio and values (`content/about.ts`); careers copy (`content/careers.ts`).
- "How an enquiry works" steps (`enquirySteps` in `content/services.ts`).
