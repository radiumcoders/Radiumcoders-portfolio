# Jay — Radiumcoders

Personal site for [Jay](https://x.com/radiumcoders): projects, GitHub sponsors, and kind words from people who’ve used the work.

I build, break, ship stuff. Sometimes I do gamedev or design eng.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [shadcn/ui](https://ui.shadcn.com)
- [next-themes](https://github.com/pacocoursey/next-themes)
- pnpm

## Features

- **Projects** — listed from `lib/projects.ts`, with live GitHub star counts (cached ~20 minutes)
- **Sponsors** — current and past GitHub Sponsors, scraped from the public sponsors pages (cached ~1 hour)
- **Kind words** — testimonials from X, laid out in a two-column masonry on desktop
- **Open Graph image** — generated from featured testimonials at `/opengraph-image`
- **Theme** — follows system preference; press `d` to toggle light/dark

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the local server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm format` | Prettier on `ts` / `tsx` files |

## Content

Most of the page is data, not markup. Edit these files:

| File | What it controls |
| --- | --- |
| `lib/projects.ts` | Project name, description, live URL, GitHub repo |
| `lib/testimonials.ts` | Quotes, avatars, featured vs trailing order |
| `lib/sponsors.ts` | GitHub login used to fetch sponsors |
| `lib/social.ts` | Discord, X, and GitHub links in the nav and footer |
| `app/layout.tsx` | Title, description, Twitter card metadata |
| `app/opengraph-image.tsx` | Social preview image |

## Environment

Optional. Without a token, star counts still load, but GitHub may rate-limit unauthenticated requests.

```bash
GITHUB_TOKEN=ghp_...
```

Copy into `.env.local` for local work. Do not commit it.

## Deploy

Meant to run on [Vercel](https://vercel.com). If star counts start disappearing in production, add `GITHUB_TOKEN` in the project env vars.

## License

Private. The site is the portfolio; the listed projects have their own repos and licenses.
