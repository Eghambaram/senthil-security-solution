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
| `pnpm test` | Vitest: schemas, form handlers (success + failure paths), content uniqueness |
| `pnpm test:e2e` | Playwright on a production build with in-memory backends (desktop + mobile): forms, navigation, redirects, and the Phase 6 QA suite (axe, link crawl, metadata, breakpoints, keyboard). Report: `docs/QA.md` |
| `pnpm db:generate` / `pnpm db:migrate` | Drizzle migrations (`drizzle/`) against `DATABASE_URL` |
| `pnpm cf:build` / `cf:preview` / `cf:deploy` | Cloudflare Workers via OpenNext (run the build on Linux/CI) |
| `pnpm build && pnpm start` | Production build and server |

Before marking work done: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

## Forms

`/api/enquiry` and `/api/careers` validate with the same zod schemas as the browser, then check the honeypot, minimum fill time, rate limit (Postgres) and Turnstile, store the submission (Neon), upload CVs privately (R2) and email the team (Resend). With no backend env vars, `pnpm dev` uses in-memory stand-ins and logs emails to the console; a production build without them returns 503. See `.env.example`.

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
