# Audiobook Reader — React Application Build Prompt

## Context

You have three reference files:

1. **`audiobook-reader-prd.md`** — The product requirements document. This is the source of truth for what the app should do. Every feature described in the PRD must be implemented. Do not add features not in the PRD. Do not skip features that are in the PRD.

2. **`audiobook-reader.html`** — A working single-file HTML prototype. This is the behavioral reference. The logic for file parsing, text-to-speech, sentence highlighting, playback controls, page navigation, and screen transitions is all functional. Use this as your behavioral reference, not as code to copy verbatim.

3. **`index.html`** — The visual design reference. This is the source of truth for all colors, typography, spacing, gradients, shadows, animations, hover states, and component styling. Extract the full design system from this file.

## Task

Build a production-ready React web application that replicates every feature of the HTML prototype, following the PRD as the specification. The app runs entirely in the browser. It is not a mobile app. No backend, no server, no data leaves the user's device.

## Tech Stack

- **Framework:** React 18+ with functional components and hooks
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6 (for the three-screen flow)
- **State Management:** React Context + useReducer for global app state (no Redux)
- **File Parsing:** pdf.js (via `pdfjs-dist` npm package) for PDFs, JSZip for EPUBs
- **Text-to-Speech:** Web Speech API (`speechSynthesis`, `SpeechSynthesisUtterance`)

## Application Architecture

### Project Structure

```
src/
├── main.tsx
├── App.tsx
├── routes/
│   ├── UploadScreen.tsx
│   ├── ContentsScreen.tsx
│   └── PlayerScreen.tsx
├── components/
│   ├── DropZone.tsx
│   ├── PageList.tsx
│   ├── PageListItem.tsx
│   ├── SearchBar.tsx
│   ├── PageStrip.tsx
│   ├── SentenceView.tsx
│   ├── PlaybackControls.tsx
│   ├── ProgressBar.tsx
│   ├── SpeedSelector.tsx
│   ├── VoiceSelector.tsx
│   └── BookMeta.tsx
├── context/
│   └── ReaderContext.tsx
├── hooks/
│   ├── useFileParser.ts
│   ├── useSpeechSynthesis.ts
│   ├── useVoices.ts
│   └── useKeyboardShortcuts.ts
├── lib/
│   ├── parsePdf.ts
│   ├── parseEpub.ts
│   └── splitSentences.ts
├── types/
│   └── index.ts
└── styles/
    └── index.css
```

### Type Definitions (`types/index.ts`)

Define the following types. Infer the exact shape from the HTML prototype's data structures:

- `Chapter` — represents a page (PDF) or chapter (EPUB) with title, text content, and page/chapter number
- `FileType` — `"pdf" | "epub"`
- `ReaderState` — the full application state including chapters array, current chapter index, sentences array, current sentence index, playback status, speed, selected voice, file metadata
- `ReaderAction` — discriminated union for all state transitions (load book, set chapter, set sentence, toggle play, set speed, set voice, reset)

### State Management (`context/ReaderContext.tsx`)

Create a React Context with `useReducer` that holds the entire reader state. Every screen reads from and dispatches to this context. The reducer must handle:

- `LOAD_BOOK` — receives parsed chapters, file name, file type
- `SET_CHAPTER` — switches to a specific chapter index, resets sentence to 0, re-splits sentences
- `SET_SENTENCE` — jumps to a specific sentence index
- `TOGGLE_PLAY` — flips playback state
- `SET_SPEED` — updates playback speed
- `SET_VOICE` — updates selected voice
- `RESET` — clears all state back to initial (for "Change Book")

### Screen Flow

The app has three screens, matching the PRD exactly:

1. **Upload Screen (`/`)** — Drop zone for file upload. Accepts `.pdf` and `.epub`. Shows error on invalid files. Navigates to Contents on successful parse.

2. **Contents Screen (`/contents`)** — Full page/chapter list with search, metadata bar, and "Play from start" button. Each item shows number, title, and text preview. Clicking an item navigates to Player and starts playback.

3. **Player Screen (`/player`)** — Sentence-by-sentence reader with active highlighting, auto-scroll, page strip, and docked playback controls. Back button returns to Contents.

If the user navigates to `/contents` or `/player` without having loaded a book, redirect to `/`.

## Feature Implementation Notes

### File Parsing

- **PDF:** Use `pdfjs-dist`. Set the worker source to the CDN or bundle it. Extract text from every page individually — one page equals one chapter entry. Skip pages with fewer than 5 characters of extracted text.
- **EPUB:** Use JSZip to unzip. Read `META-INF/container.xml` to find the OPF file. Read the OPF to get the spine order and manifest. Extract text from each HTML file in spine order. Use the first `h1`, `h2`, `h3`, or `<title>` as the chapter title. Skip entries with fewer than 20 characters.
- **Loading state:** Show a loading screen with a spinner and a progress message that updates per-page for PDFs (e.g., "Extracting page 12 of 84…").

### Sentence Splitting (`lib/splitSentences.ts`)

Split chapter text into sentences using the same logic as the HTML prototype:
- Collapse multiple newlines into single newlines
- Split on sentence-ending punctuation followed by whitespace, or on newlines
- Trim each result
- Filter out fragments shorter than 3 characters

### Text-to-Speech (`hooks/useSpeechSynthesis.ts`)

Create a custom hook that encapsulates all speech synthesis logic:

- Exposes: `speak(text)`, `stop()`, `isSupported`
- Accepts: `speed`, `voice`, `onEnd` callback
- On sentence end, calls `onEnd` which advances to the next sentence
- On chapter end (last sentence finishes), automatically loads the next chapter and continues
- On book end (last sentence of last chapter), stops playback
- Cancels current utterance before speaking a new one
- Handles the `onerror` event gracefully — skip to next sentence on non-interruption errors

### Voice Loading (`hooks/useVoices.ts`)

- Load voices on mount and on `voiceschanged` event
- Default to the first English local voice, falling back to any English voice, falling back to the first available voice
- Return the voices array and the currently selected voice

### Keyboard Shortcuts (`hooks/useKeyboardShortcuts.ts`)

Only active on the Player screen:
- `Space` — toggle play/pause (prevent default scroll)
- `ArrowRight` — advance one sentence
- `ArrowLeft` — go back one sentence

### Page Strip Component

- Horizontally scrollable row of page/chapter tabs
- Active tab is visually distinct
- On chapter change, auto-scroll the strip to center the active tab using `scrollIntoView({ behavior: "smooth", inline: "center" })`
- Labels: `Pg 1`, `Pg 2`… for PDFs, truncated chapter titles for EPUBs

### Sentence View Component

- Render each sentence as a clickable div
- Active sentence gets a highlighted style (brighter text, subtle background, left border accent)
- Auto-scroll active sentence into view on change
- Clicking any sentence jumps playback to that sentence

### Playback Controls (docked at bottom)

- Fixed position at the bottom of the viewport
- Gradient fade background so text scrolls underneath cleanly
- Contains: voice selector, previous page button, skip back 5 sentences, play/pause, skip forward 5 sentences, next page button, speed selector
- Progress bar: shows `currentSentence / totalSentences`, clickable to jump

### Search (Contents Screen)

- Filter the page/chapter list by keyword
- Match against both the title and the first 200 characters of text content
- Case-insensitive
- Real-time filtering on input change

## Visual Design

Extract the complete visual design from `index.html`. Read its CSS variables, inline styles, class definitions, gradients, shadows, transitions, and hover states. Map every color, font, spacing value, and component style into `tailwind.config.ts` as custom theme extensions.

Do not invent new colors. Do not override the existing palette. The `index.html` file is the single source of truth for how every screen, component, and state should look.

Use Tailwind CSS to replicate this. Use Tailwind utility classes referencing the custom config — do not use arbitrary `[]` values inline where a config extension would be cleaner.

## Quality Requirements

- No `any` types. Every function, component prop, and state value must be typed.
- No `eslint-disable` comments.
- Every component should be a separate file with a single default export.
- Use `React.memo` on the `SentenceView` items to prevent unnecessary re-renders when only the active index changes.
- The speech synthesis hook must clean up on unmount — cancel any active utterance.
- File parsing must run in a try/catch with user-facing error messages on failure.
- The app must work with no network connection after initial load (all parsing and TTS is local).

## What NOT to Build

Do not implement anything from the PRD's "Out of Scope" section:
- No bookmarking or position saving
- No cloud storage or syncing
- No user accounts
- No file formats beyond PDF and EPUB
- No custom themes
- No offline PWA / service worker
- No external TTS engine integration
- No annotations or note-taking

## Deliverable

A complete, runnable Vite + React + TypeScript project. After running `npm install` and `npm run dev`, the app should open in the browser and be fully functional — upload a PDF or EPUB, browse pages, and listen to it read aloud.
