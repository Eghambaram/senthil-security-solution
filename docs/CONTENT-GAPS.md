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
| 7 | Confirmed service list (industrial, corporate/commercial, IT, ATM, residential, event, personal protection, religious facilities, armed, housekeeping?) | Client | Unconfirmed service pages stay unpublished |
| 8 | Areas served (live site says "Chennai or across India") | Client | Copy says "based in Tambaram, serving Chennai" only |
| 9 | Office hours (Sulekha: Mon–Sat 9–7) | Client | Hours hidden; no `openingHours` in JSON-LD |
| 10 | Training topics, PF/ESI benefits, staff verification, ex-forces backgrounds | Client | About/Careers use generic wording without these specifics |
| 11 | Approved client names/logos and written testimonials | Client | No client strip; "Company at a glance" used instead |
| 12 | Leadership names, titles, bios, photos (Senthil Raja per Sulekha) | Client | No leadership section; `/company.php` redirects to `/about` |
| 13 | Authentic photography or approval for a shoot / illustrative imagery | Client | Neutral, unbranded illustrative images, labelled in `content/images.ts` |
| 14 | Careers data handler and retention period | Client | Default 6 months, stated in privacy policy as provisional |
| 15 | Domain/DNS registrar access | Client | Blocks Phase 7 cut-over |
| 16 | Vector logo (SVG/AI) | Client | Clean trace of PNG, needs approval |
| 17 | Confirm the 4-step approach matches real practice | Client | Process section held back |
| 18 | LinkedIn / Twitter URLs | Client | Facebook only in footer |
