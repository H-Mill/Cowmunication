# Cowmunication 🐄

Bridging the gap between humans and cows since 2026.

Cowmunication is a tiny browser app that translates human text into **moo
language** and decodes it back again — no signup, no backend, everything runs
locally in your browser.

**Live:** https://h-mill.github.io/Cowmunication/

## What it does

- **Human → Cow** — turns plain text into a stream of "Moo" words.
- **Cow → Human** — decodes moo back into the original text.
- Round-trips losslessly, including punctuation, spaces, and non-Latin
  characters (full UTF-8).

## How the moo codec works

Translation is handled by [`MooCodec`](src/lib/MooCodec.ts):

- Each run of letters/digits becomes one **moo** — a leading `M`/`m` (matching
  the word's first-letter case) followed by an encoding of its UTF-8 bytes.
- Every byte is encoded as a prefix-free code built from **O-lookalike glyphs**
  drawn from four scripts (Latin, Cyrillic, Greek, Armenian). Capital forms are
  "lead" glyphs, lowercase forms are "stop" glyphs, so codes concatenate without
  separators and parse unambiguously.
- Codes are assigned shortest-first in English letter-frequency order, so common
  letters like `e` and `t` produce the shortest moos.
- Spaces, punctuation, and symbols pass through literally (quotes get special
  glyph treatment) so the output stays readable.

## Getting started

Requires Node.js 22+.

```bash
npm install      # install dependencies
npm run dev      # start the dev server
npm run build    # type-check and build to dist/
npm run preview  # preview the production build
```

## Deployment

Pushing to `main` triggers the [GitHub Actions workflow](.github/workflows/deploy.yml),
which builds the app and publishes `dist/` to GitHub Pages. The Vite `base` is
set to `/Cowmunication/` to match the project-page path.

## Tech stack

React 19 · TypeScript · Vite · CSS Modules
