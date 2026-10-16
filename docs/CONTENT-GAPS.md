# Content gaps

Open items that block or limit what the site can show. Updated at the end of Phase 1 (16 Oct 2026).

Owner: **Client** = Senthil Security Solutions · **Dev** = build team.

## Blocking

| # | Item | Owner | Impact if unresolved |
|---|---|---|---|
| 1 | Business email for enquiries and careers. The live site lists `info@` and `support@senthilsecuritysolutions.com`: which inbox is monitored? | Client | Form notifications cannot be sent; no email shown on site |
| 2 | PSARA licence number and validity | Client | No compliance strip; no "licensed" claim anywhere |
| 3 | Arms-licence status | Client | Armed & Ex-Servicemen page and card stay hidden; "Gunman" role hidden on careers form |
| 4 | Legal entity (Proprietorship / Partnership / LLP / Pvt Ltd); show GSTIN? | Client | Entity type and GSTIN not printed |

## Important

| # | Item | Owner | Impact if unresolved |
|---|---|---|---|
| 5 | Mobile / WhatsApp number. The live site shows 90940 25252, 95511 25252 and 90943 31333; its tel: links dial 044 4850 9111 | Client | No WhatsApp button; mobile bar shows Call + Enquire only |
| 6 | Personnel strength (site says ~500; third party says 185) and active site count | Client | Hero shows "Ex-forces leadership" instead of a counter |
| 7 | Confirmed service list (industrial, corporate/commercial, IT, ATM, residential, event, personal protection, religious facilities, armed, housekeeping?) and sectors served | Client | **Production currently shows no service or industry links at all**; homepage service cards will be empty |
| 8 | Areas served (live site says "Chennai or across India") | Client | Copy says "based in Tambaram, serving Chennai" only |
| 9 | Office hours (Sulekha: Mon–Sat 9–7) | Client | Hours hidden; no `openingHours` in JSON-LD |
| 10 | Training topics, PF/ESI benefits, staff verification, ex-forces backgrounds | Client | About/Careers use generic wording without these specifics |
| 11 | Approved client names/logos and written testimonials | Client | No client strip; "Company at a glance" used instead |
| 12 | Leadership names, titles, bios, photos (Senthil Raja per Sulekha) | Client | No leadership section; `/company.php` redirects to `/about` |
| 13 | Authentic photography or approval for a shoot / illustrative imagery | Client | Neutral navy placeholder frames (see shot list below); site looks unfinished without photos |
| 14 | Careers data handler and retention period | Client | Default 6 months, stated in privacy policy as provisional |
| 15 | Domain/DNS registrar access | Client | Blocks Phase 7 cut-over |
| 16 | Vector logo (SVG/AI); approval of crest colours (maroon/peach) next to the navy/gold site palette | Client | 200 px raster crest used; may look soft on high-density screens |
| 17 | Confirm the 4-step approach matches real practice | Client | Process section held back |
| 18 | LinkedIn / Twitter URLs | Client | Facebook only in footer |
| 19 | **Legal review of `/privacy-policy` and `/terms`** (drafts in `content/legal.ts`), including a named grievance contact | Client / lawyer | Must be signed off before launch |
| 20 | Careers eligibility: minimum age, education, physical fitness, documents required | Client | Eligibility section not shown |
| 21 | Response-time commitment for enquiries (e.g. "we reply within one working day") | Client | No promise shown on `/site-assessment` |
| 22 | Authentic, approved photos for a gallery | Client | `/gallery` not built; omitted from nav and sitemap |

## Photography shot list

Every image slot is in `content/images.ts`. Until approved photos exist, these render as neutral navy frames. Rules: authentic photos preferred; no "SENTHIL" branding on stock/AI images; no firearms or control rooms unless real (CLAUDE.md §2.4).

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

- Why-choose-us one-line support text and the four "Our approach" step descriptions (`content/home.ts`).
- Homepage FAQ answers (`content/faqs.ts`).
- All service page copy and FAQs (`content/services.ts`) — each service goes live only when switched to `verified`.
- All industry page copy (`content/industries.ts`).
- About page story and values (`content/about.ts`), careers copy (`content/careers.ts`).
- "How an enquiry works" steps (`enquirySteps` in `content/services.ts`).
