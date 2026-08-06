# oriz-text — Text Toolkit

**Live: https://text.oriz.in**

A writing-desk text toolkit. Case convert, word/char/line count, dedupe & sort lines, slugify, lorem ipsum, reverse, remove extra spaces, and find & replace — plus optional AI polish (rewrite / summarize / tone / grammar / translate).

**100% client-side. No upload. No signup.** Every transform runs in your browser; your text never leaves the page. The AI features are optional, load on demand, and the core tools work with AI fully offline.

## Features

- **Case:** UPPER, lower, Title, Sentence, tOGGLE
- **Programmer:** camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, slugify
- **Lines:** sort A→Z / Z→A / numeric, dedupe, reverse, shuffle
- **Whitespace:** trim lines, remove extra spaces, remove blank lines
- **Reverse:** characters, words
- **Find & replace:** literal or regex (with `$1` backrefs), ignore-case
- **Lorem ipsum:** paragraphs / sentences / words
- **Live meter:** words, chars, chars-no-spaces, lines, sentences, paragraphs, reading time — ticks as you type
- **AI (optional):** fix grammar, summarize, rewrite, formal/casual tone, translate — via `@chirag127/oz-ai` (g4f multi-provider failover, no key)
- Drag-drop a file, open file, copy, download `.txt`, undo

## Stack

Astro (static) · React 19 islands · Tailwind v4 · shared `@chirag127/oz-*` packages. Zero string-op dependencies — all native.

## Develop

```bash
npm install --legacy-peer-deps
npm run dev        # local
npm test           # vitest — pure logic
npm run build      # static dist/
npm run deploy     # build + wrangler pages deploy
```

> Windows: use **npm** (pnpm skips `@esbuild/win32-x64`).

## License

MIT © 2026 Chirag Singhal
