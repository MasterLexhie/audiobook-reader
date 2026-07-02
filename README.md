# Audiobook Reader

Turn any PDF or EPUB into an audiobook — entirely in your browser.

<!-- TODO: Add a screenshot of the player screen to docs/screenshot.png -->

[//]: # (![Audiobook Reader — Player Screen]&#40;./docs/screenshot.png&#41;)

## What it does

Audiobook Reader is a browser-based app that reads your books and documents aloud with sentence-by-sentence highlighting. Drop in a PDF or EPUB, pick a page or chapter, and listen. The text scrolls automatically to follow along, and you can tap any sentence to jump there. Everything runs client-side — no backend, no accounts, no data leaves your device.

## Getting started

```sh
# Requires Node.js 18+
git clone https://github.com/your-username/audiobook-reader.git
cd audiobook-reader
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Features

### File Support

- PDF and EPUB file parsing, entirely in-browser
- Per-page content extraction for PDFs, chapter-aware extraction for EPUBs
- Progress indicator during file processing

### Playback

- Text-to-speech narration using the browser's built-in speech synthesis
- Sentence-level highlighting with auto-scroll
- Automatic advancement across sentences, pages, and chapters
- Adjustable speed: 0.75x, 1x, 1.25x, 1.5x, 2x
- Voice selection from all voices available in the user's browser

### Navigation

- Searchable table of contents with text previews
- Horizontally scrollable page/chapter strip in the player
- Click any sentence to jump playback to that point
- Back button returns to contents; "Change Book" resets to upload

### Controls

- Play/pause, skip forward/back by 5 sentences, prev/next chapter
- Clickable progress bar with sentence position
- Keyboard shortcuts: Space (play/pause), Arrow keys (prev/next sentence)

## Tech stack

- **React** — UI components and screen routing
- **TypeScript** — type safety across the full codebase
- **Vite** — dev server and production builds
- **Tailwind CSS** — styling with a custom design token palette
- **pdfjs-dist** — PDF text extraction
- **JSZip** — EPUB unpacking and chapter parsing
- **Web Speech API** — browser-native text-to-speech

## Project structure

```
src/
├── routes/        # Three screen components (Upload, Contents, Player)
├── components/    # Reusable UI (DropZone, PageStrip, PlaybackControls, etc.)
├── context/       # ReaderContext — global state via useReducer
├── hooks/         # Speech synthesis, voice loading, file parsing, keyboard shortcuts
├── lib/           # Pure functions for PDF/EPUB parsing and sentence splitting
├── types/         # Shared TypeScript type definitions
└── styles/        # Tailwind entry point with custom theme
```

## How it works

When a user drops a file, the app reads it as an `ArrayBuffer` and passes it to either `parsePdf` (using pdfjs-dist) or `parseEpub` (using JSZip to unzip and walk the OPF spine). Each parser returns an array of chapters with their extracted text. The text for each chapter is split into sentences using regex-based boundary detection. On the player screen, a `useSpeechSynthesis` hook creates a `SpeechSynthesisUtterance` for the current sentence; when the browser finishes speaking, the `onend` callback advances to the next sentence — or the next chapter if the current one is exhausted. The active sentence index drives both the highlight styling and an auto-scroll via `scrollIntoView`.

## Browser support

Works in any modern browser that supports the Web Speech API (Chrome, Firefox, Safari, Edge). Voice availability varies by browser and operating system — Chrome on desktop typically offers the widest selection. All file parsing and playback runs locally with no network dependency after the initial page load.

[//]: # (## Contributing)

[//]: # ()
[//]: # (Fork the repo, create a feature branch, and open a pull request. The project follows a strict v1 scope defined in the product requirements document — features outside that scope are not being accepted yet. See [`audiobook-reader-prd.md`]&#40;./audiobook-reader-prd.md&#41; for the full specification.)

## License

MIT — see [LICENSE](./LICENSE) for details.
