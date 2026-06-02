# Lensview

Next.js app on Vercel that serves a folder of hand-authored standalone HTML files at clean URLs.

- `pages-content/public/<slug>.html` is served at `/<slug>` (e.g. `/page1`).
- `pages-content/protected/<slug>.html` exists but returns 404 until auth is wired up.
- `/` is a React landing page that lists the public pages.

## Layout

```
app/
  layout.tsx
  page.tsx            # landing page (React)
  [slug]/route.ts     # serves raw HTML from pages-content/
lib/
  pages.ts            # slug validation + file lookup
pages-content/
  public/             # publicly served HTML
  protected/          # placeholder for auth-gated HTML
```

## Develop

```sh
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Add a page

Drop a file at `pages-content/public/my-page.html` — it will be served at `/my-page` and listed on `/`.

Slugs must match `[a-zA-Z0-9_-]+`; the directory structure is the URL routing.

## Deploy

```sh
vercel
```

Project configuration lives in `vercel.ts`.

## Auth (deferred)

Pages under `pages-content/protected/` are routed but currently return 404. The single TODO marker in `app/[slug]/route.ts` is where the auth check will go (likely Clerk via the Vercel Marketplace).

## Design

See [`docs/superpowers/specs/2026-06-02-lensview-html-host-design.md`](docs/superpowers/specs/2026-06-02-lensview-html-host-design.md).
