# Lensview

Next.js app on Vercel that serves a folder of hand-authored standalone HTML files at clean URLs.

- `pages-content/public/<UNIQUE_ID>.html` is served at `/page/<UNIQUE_ID>/<anything>` (e.g. `/page/page1/intro`). The trailing path segments after the ID are free-form and ignored by the server.
- `pages-content/protected/<UNIQUE_ID>.html` exists but returns 404 until auth is wired up.
- `/` is a React landing page that lists the public pages.

## Layout

```
app/
  layout.tsx
  page.tsx                                      # landing page (React)
  page/[uniqueId]/[[...rest]]/route.ts          # serves raw HTML from pages-content/
lib/
  pages.ts                                      # ID validation + file lookup
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

Drop a file at `pages-content/public/my-page.html` — it will be served at `/page/my-page` (or `/page/my-page/anything-you-want`) and listed on `/`.

IDs must match `[a-zA-Z0-9_-]+`; the trailing URL segments after the ID are free-form and ignored.

## Deploy

```sh
vercel
```

Project configuration lives in `vercel.ts`.

## Auth (deferred)

Pages under `pages-content/protected/` are routed but currently return 404. The single TODO marker in `app/page/[uniqueId]/[[...rest]]/route.ts` is where the auth check will go (likely Clerk via the Vercel Marketplace).

## Design

See [`docs/superpowers/specs/2026-06-02-lensview-html-host-design.md`](docs/superpowers/specs/2026-06-02-lensview-html-host-design.md).
