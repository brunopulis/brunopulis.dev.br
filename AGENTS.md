# AGENTS.md — studio

Personal site for Bruno Pulis (@brunopulis). Accessible digital consultancy portfolio.

## Stack

- **Static site generator**: [Eleventy](https://www.11ty.dev/) v3.1.5, with Nunjucks (`.njk`) templates
- **CSS**: [Tailwind CSS v4](https://tailwindcss.com/) via CLI (not PostCSS/Vite plugin)
- **Formatter**: Prettier (`.prettierrc` + `.prettierignore`), no npm script — run via `npx prettier --check .`
- **Deploy**: Vercel (`vercel.json` controls build command, output dir, and security headers)
- **No** client-side framework, TypeScript, linter, tests, or CI workflows

## Project structure

```
src/
  _data/theme.json              — global site data (name, seo, colors, nav items)
  _includes/partials/           — reusable Nunjucks partials
  _layouts/                     — empty (every page is a standalone HTML document)
  assets/css/
    tailwind.css                — Tailwind v4 source (@import + @theme + custom CSS)
    index.css                   — generated Tailwind output (gitignored via _site/)
  public/                       — empty passthrough dir
  index.njk                     — homepage
  servicos.njk, sobre.njk, portfolio.njk, palestras.njk, contato.njk
```

**Styling split**: Homepage (`index.njk`) and its partials use **Tailwind utility classes** directly. Internal pages use **hand-written CSS classes** defined in `tailwind.css`. Navigation is hardcoded independently in `_includes/partials/navigation.njk` and in each internal page — the `navigation` key in `theme.json` is unused.

## Commands

| Command | Purpose |
|---|---|
| `npm start` | Dev server — runs Tailwind watch + Eleventy serve in parallel |
| `npm run build` | Production build — Tailwind (minified) + Eleventy |
| `npm run build:css` | Single Tailwind build |
| `npm run clean` | Remove `_site/` and generated `index.css` |

## Build notes

- Tailwind source is `src/assets/css/tailwind.css`, output is `src/assets/css/index.css`.
- Eleventy input is `src/`, output is `_site/`. Config (`.eleventy.js`) is minimal — sets passthrough copies and dirs only; **no Eleventy plugins are wired up** despite several being in `package.json`.
- `.eleventyignore` skips `tests/`, `scripts/`, `api/` directories.
- Passthrough copies: `src/assets` (images) and `src/public` → output root.

## Theme & styling

- Brand colors are defined as Tailwind v4 `@theme` tokens in `tailwind.css`.
- `--dark-mode: class` is set in `@theme` but there is **no dark mode toggle or JS** — dark mode is non-functional.
- `_includes/partials/hero.njk:7` references `text-brand-red` — no such token exists; it renders as a no-op class.

## Vercel deploy

- `vercel.json`: `buildCommand: "npm run build"`, `outputDirectory: "_site"`. Includes a strict `Content-Security-Policy` and other security headers.

## Package manager

Use `npm`. Lockfile: `package-lock.json` (`pnpm-lock.yaml` exists but is gitignored). `.npmrc` hoists all packages (`shamefully-hoist=true`).
