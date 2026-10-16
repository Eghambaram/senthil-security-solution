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
| `pnpm build && pnpm start` | Production build and server |

Before marking work done: `pnpm lint && pnpm typecheck && pnpm build`.

## Content gating

Business facts live in `content/` with a `status` per item (`lib/facts.ts`):

- `verified`: always shown.
- `pending`: shown in development with a yellow **PENDING** badge; **hidden in production**.
- `missing` / `conflict`: never shown.

Because every service and industry is still `pending`, a production build currently shows no service or industry links. That is intended until the client confirms them (`docs/CONTENT-GAPS.md`).

## Styleguide

`/styleguide` shows every token and component. It returns 404 in production.
