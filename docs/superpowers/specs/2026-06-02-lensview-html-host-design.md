---
date: 2026-06-02
status: approved
---

# Lensview — Standalone HTML Page Host

## Goal

A Vercel-hosted Next.js app that serves a folder of hand-authored standalone HTML files at clean URLs (`/page1` → `pages-content/public/page1.html`). React is used only for a landing page that lists the available pages. The repo is structured to support a future "protected pages" tier (auth gate), but auth itself is deferred.

## Non-goals

- Authentication / authorization wiring (placeholder only; protected pages 404 until auth lands)
- Admin / upload UI for pages
- Per-page custom headers, caching strategies, or CDN tuning beyond Next.js defaults
- Tests for scaffolding (no behavior worth testing yet)
- Rendering React chrome (header/nav/footer) around HTML pages — pages are served raw

## Stack

- Next.js 16 (App Router), TypeScript
- React 19 (landing page only)
- Node.js 24 runtime, Fluid Compute defaults
- Vercel project config via `vercel.ts`

## Repo layout

```
lensview/
├── app/
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # React landing — lists public pages
│   └── [slug]/route.ts             # Dynamic route — serves raw HTML
├── pages-content/                  # Hand-authored HTML (renamed to avoid Next.js Pages Router conflict)
│   ├── public/
│   │   ├── page1.html
│   │   └── welcome.html
│   └── protected/
│       └── secret.html             # Returns 404 for now (auth deferred)
├── lib/
│   └── pages.ts                    # listPublicPages(), resolveSlug(slug)
├── public/                         # Next.js static assets
├── docs/superpowers/specs/
├── package.json
├── tsconfig.json
├── next.config.ts
├── vercel.ts
├── .gitignore
└── README.md
```

## Routing behavior

`app/[slug]/route.ts` is a GET Route Handler:

1. Sanitize `slug` — reject anything that isn't `[a-zA-Z0-9_-]+`. Return 404 on bad input.
2. Try `pages-content/public/{slug}.html`. If it exists, read and return with `Content-Type: text/html; charset=utf-8`.
3. Else try `pages-content/protected/{slug}.html`. If it exists, this is where the future auth gate goes. For now, return 404.
4. Else return 404.

Path safety: the sanitization regex prevents `..` and slashes, so directory traversal is structurally impossible.

## Landing page

`app/page.tsx` is a React Server Component that calls `lib/pages.ts → listPublicPages()` (reads `pages-content/public/` at request time, returns slug list) and renders a `<ul>` of links. Protected pages are intentionally not listed; they're effectively hidden until auth is wired.

## Auth placeholder

The protected branch in `app/[slug]/route.ts` is the single, marked TODO site. When auth is added:

- Either add a middleware (`middleware.ts`) that gates `/protected/*` paths and rewrites cleanly, or
- Inline the auth check in the route handler before the file read.

Clerk via the Vercel Marketplace is the likely choice, but the decision is deferred.

## Vercel config

`vercel.ts` exports a minimal `VercelConfig`:
- `framework: 'nextjs'`
- Default build command

No rewrites, redirects, headers, or crons at this stage.

## Seed content

Three HTML files ship in the repo so the structure is obvious and the app does something useful out of the box:

- `pages-content/public/page1.html` — minimal example
- `pages-content/public/welcome.html` — slightly richer example with inline styles
- `pages-content/protected/secret.html` — present in the tree, returns 404 until auth lands

## Build & deploy

- `npm install` → `npm run dev` for local
- `vercel` for deploy; default project linkage via standard CLI flow

## Open questions for later

- Auth provider choice (Clerk vs shared password vs custom)
- Whether to add an admin UI for listing/uploading pages
- Caching headers for HTML files (currently rely on Next.js defaults)
- Whether `pages-content/` should be moved into a `content/` or `data/` parent directory if more content types are added
