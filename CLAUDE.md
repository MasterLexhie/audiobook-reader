# Audiobook Reader

Browser-based web app that converts PDF and EPUB files into an audiobook-like listening experience using text-to-speech. Fully client-side — no backend, no server, no data leaves the browser.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run lint` — ESLint check
- `npm run typecheck` — `tsc --noEmit`
- Run `npm run typecheck` after every set of changes before considering a task done

## Stack

- React 18, TypeScript, Vite
- Tailwind CSS (custom palette in `tailwind.config.ts`)
- React Router v6 (three routes: `/`, `/contents`, `/player`)
- `pdfjs-dist` for PDF text extraction
- `jszip` for EPUB unpacking
- Web Speech API (`speechSynthesis`) for TTS — no external API

## Architecture

```
src/
├── routes/          Three screen components, one per route
├── components/      Reusable UI — DropZone, PageStrip, PlaybackControls, etc.
├── context/         ReaderContext with useReducer for all app state
├── hooks/           useSpeechSynthesis, useVoices, useFileParser, useKeyboardShortcuts
├── lib/             Pure functions: parsePdf, parseEpub, splitSentences
├── types/           Shared TypeScript types
└── styles/          Tailwind entry point
```

- **State flows through `ReaderContext` only.** No prop drilling for chapters, playback, or voice state. Components read from context and dispatch actions.
- **Parsing logic lives in `lib/`, not in components.** `parsePdf.ts` and `parseEpub.ts` are pure async functions that accept an `ArrayBuffer` and return a `Chapter[]`.
- **Speech logic lives in `hooks/useSpeechSynthesis.ts`.** It owns all `speechSynthesis` API interaction — speak, cancel, handle `onend`, handle errors. Components never call `speechSynthesis` directly.

## Screen Flow

1. **Upload (`/`)** — file drop/select → parse → navigate to `/contents`
2. **Contents (`/contents`)** — page/chapter list with search, metadata, "Play from start" → navigate to `/player`
3. **Player (`/player`)** — sentence reader with TTS, page strip, playback controls, back to `/contents`

If no book is loaded, `/contents` and `/player` redirect to `/`.

## Key Conventions

- No `any` types. Every prop, state value, and function parameter is typed.
- One component per file, default export.
- Hooks return objects, not arrays (e.g., `const { speak, stop } = useSpeechSynthesis()`).
- `React.memo` on `SentenceView` list items — the sentence list can be 200+ items.
- Speech synthesis must `cancel()` before every new `speak()` call and clean up on component unmount.
- File parsing runs in try/catch with user-facing error messages — never let a parse error crash silently.
- PDF: one page = one chapter entry. Skip pages with < 5 chars.
- EPUB: read spine order from OPF. Use first heading as chapter title. Skip entries with < 20 chars.

## Visual Design

Extract all visual design from @index.html — colors, gradients, typography, spacing, shadows, transitions, hover states, and component styling. Do not invent new colors or override the existing palette. Read the CSS variables and inline styles from that file and map them into `tailwind.config.ts` as custom theme extensions. Use Tailwind utility classes referencing the config — avoid arbitrary `[]` values where a config extension is cleaner.

## Do Not

- Do not add a backend, API calls, or server-side logic
- Do not add localStorage, IndexedDB, or any persistence
- Do not add service workers, PWA manifest, or offline caching
- Do not add user accounts, auth, or analytics
- Do not support file formats other than PDF and EPUB
- Do not integrate external TTS APIs (ElevenLabs, OpenAI, etc.) — browser speech only
- Do not add features not listed in @audiobook-reader-prd.md

## Reference

- @audiobook-reader-prd.md — product requirements (source of truth for features)
- @index.html — visual design reference (source of truth for colors, typography, layout, and component styling)
- @audiobook-reader.html — working HTML prototype (behavioral reference for parsing, TTS, and interaction logic)
- @react-build-prompt.md — detailed build specification with component breakdown
