# Senthil Security Solutions — website

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4.

Read `CLAUDE.md` (rules and facts) and `PROMPT.md` (build brief) before changing anything.

## Setup

```bash
pnpm install
cp .env.example .env.local   # fill in values as services are provisioned
pnpm dev                     # http://localhost:3000
```

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Local dev server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest: schemas, form handlers (success + failure paths), SMTP client (against a scripted local mail server), content uniqueness |
| `pnpm mail:test [to]` | Check the SMTP settings in `.env.local`; with an address, send a test email |
| `pnpm test:e2e` | Playwright on a production build with in-memory backends (desktop + mobile): forms, navigation, redirects, and the Phase 6 QA suite (axe, link crawl, metadata, breakpoints, keyboard). Report: `docs/QA.md` |
| `pnpm db:generate` / `pnpm db:migrate` | Drizzle migrations (`drizzle/`) against `DATABASE_URL` |
| `pnpm cf:build` / `cf:preview` / `cf:deploy` | Cloudflare Workers via OpenNext (run the build on Linux/CI) |
| `pnpm build && pnpm start` | Production build and server |

Before marking work done: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

## Forms

`/api/enquiry` and `/api/careers` validate with the same zod schemas as the browser, check the honeypot, minimum fill time, rate limit and (if configured) Turnstile, then email the team.

**Only email is required.** Notifications go through the company's own mailbox over SMTP (`lib/email/smtp.ts`, a small built-in client that runs on Cloudflare Workers and Node; no third-party email service). Resend remains an alternative. Everything else is optional:

| Not configured | What happens |
|---|---|
| `DATABASE_URL` (Neon) | Nothing is stored; the email is the record. Rate limiting is kept in memory per Worker instance |
| R2 | CVs are attached to the careers email instead of a private download link |
| Turnstile | Honeypot, minimum fill time and rate limit still apply |

A form shows success only after the mail server accepts the message. With no email settings, `pnpm dev` uses an in-memory outbox (logged to the console) and a production build returns 503 with the phone number. See `.env.example`.

Check the mailbox settings before going live:

```bash
pnpm mail:test                  # connect and log in only
pnpm mail:test you@example.com  # also send a test email
```

## Content gating

Business facts live in `content/` with a `status` per item (`lib/facts.ts`):

- `verified`: always shown.
- `pending`: shown in development with a yellow **PENDING** badge; **hidden in production**.
- `missing` / `conflict`: never shown.

Because every service and industry is still `pending`, a production build currently shows no service or industry links. That is intended until the client confirms them (`docs/CONTENT-GAPS.md`).

## Client review preview

Build with `NEXT_PUBLIC_REVIEW_MODE=1` to deploy a preview for client approval: pending content is shown with yellow **PENDING** badges and photo briefs, search engines are blocked (`noindex`, `robots.txt Disallow: /`), and forms work without backends but clearly say the submission was **not sent**. Never set this flag on the live site.

## Styleguide

`/styleguide` shows every token and component. It returns 404 in production.
