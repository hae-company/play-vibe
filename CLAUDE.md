# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server (Next.js 16 with Turbopack)
- `npm run build` — production build
- `npm run lint` — ESLint
- No test framework is configured

## Architecture

**"Vibe Coding Lab"** — a Korean-language portfolio site showcasing hobby projects. Next.js 16 App Router with React 19, Tailwind CSS v4, shadcn/ui components, and Upstash Redis for persistence.

### Data flow

All project data lives in Upstash Redis (single key `"projects"`), not in the filesystem. The static array in `src/data/projects.ts` defines the `Project` type and `categories` but is **not** the runtime data source — the API routes read/write Redis.

- **Public**: Homepage (`src/app/page.tsx`, client component) fetches `/api/projects`, filters by `published`, supports search + category filter + infinite scroll.
- **Admin**: `/admin` page — password-gated (header `x-admin-password` checked against `ADMIN_PASSWORD` env var). CRUD for projects, plus URL meta auto-fill via `/api/meta`.
- **Likes**: Per-project like counts stored in Redis keys `likes:{id}`. Batch fetch via `POST /api/likes`, individual via `/api/likes/[id]`.

### Environment variables (required)

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `ADMIN_PASSWORD`

### UI

- shadcn/ui components in `src/components/ui/`
- `next-themes` for dark mode via `ThemeProvider`
- `@` path alias maps to `src/`
