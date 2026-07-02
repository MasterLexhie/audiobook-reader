# Audiobook Reader — Product Requirements Document

**Version:** 1.0
**Last Updated:** July 2026
**Status:** In Development

---

## Overview

Audiobook Reader is a browser-based web application that transforms PDF and EPUB files into a hands-free listening experience. Users upload a document, browse its contents, and have the text read aloud with sentence-level highlighting — turning any digital book or document into an audiobook.

The application runs entirely in the browser. There is no server, no backend, and no data leaves the user's device. It is not a mobile app — it is a client-side web application accessed through a desktop or mobile browser.

---

## Problem Statement

Readers often have books and documents in PDF or EPUB format but lack the time or ability to sit and read them. Existing text-to-speech tools are either buried in OS accessibility settings, require paid subscriptions, or offer no meaningful reading interface. There is no simple, free, zero-setup way to drop a file into a browser and have it read back like an audiobook with a proper listening experience.

---

## Target Users

- Readers who want to consume books and long documents hands-free while multitasking
- Students reviewing study material, textbooks, or lecture notes in PDF format
- Professionals listening to reports, whitepapers, or documentation
- Users with visual impairments or reading difficulties who benefit from audio narration
- Anyone who prefers listening over reading

---

## Platform

This is a **browser-based web application** designed to run in modern desktop and mobile browsers (Chrome, Firefox, Safari, Edge). It is not a native mobile app and is not distributed through any app store. All processing happens client-side within the browser — no files are uploaded to a server.

---

## Core User Flow

The application follows a three-screen flow that mirrors the experience of opening a physical book.

### Screen 1 — Upload

The entry point. The user arrives at a clean, focused screen with a single purpose: select a book. They can drag and drop a file or click to browse. The application accepts PDF and EPUB formats. If the file is unsupported or cannot be parsed, a clear error message is shown. There are no accounts, no sign-ups, and no onboarding steps.

### Screen 2 — Contents

After the file is processed, the user sees a full table of contents. For PDFs, this is a list of every page. For EPUBs, this is a list of chapters extracted from the book's structure. Each entry shows a title and a short text preview so the user can identify where they want to start.

The contents screen also displays book metadata at a glance: total number of pages or chapters, estimated listening time, and word count. A search bar at the top lets the user filter entries by keyword. A prominent "Play from start" button is available for users who want to begin immediately without browsing.

### Screen 3 — Player

The listening screen. The selected page or chapter is displayed as a series of sentences. The currently spoken sentence is highlighted and the view automatically scrolls to keep it centered. Users can click or tap any sentence to jump the narration to that point.

A persistent page strip across the top shows all pages or chapters as horizontally scrollable tabs, with the current one highlighted. This allows quick, visible navigation without leaving the player.

Playback controls are docked at the bottom of the screen, always accessible.

---

## Features

### File Support

- Accepts PDF files of any length
- Accepts EPUB files (EPUB 2 and EPUB 3 formats)
- Extracts readable text content from uploaded files
- Preserves chapter structure from EPUB files
- Generates a per-page content list for PDF files
- Displays a progress indicator during file extraction so the user knows it is working

### Contents View

- Lists every page (PDF) or chapter (EPUB) with its title
- Shows a short text preview beneath each entry so users can identify content at a glance
- Displays book metadata: total pages/chapters, estimated listening time, total word count
- Provides a search bar to filter pages or chapters by keyword
- Highlights the currently playing entry if the user returns to this screen during playback
- Offers a single-tap "Play from start" action for immediate listening

### Text-to-Speech Playback

- Reads text aloud using the browser's built-in speech synthesis
- Narrates one sentence at a time with automatic advancement to the next
- Automatically advances to the next page or chapter when the current one finishes
- Stops at the end of the book

### Sentence-Level Highlighting

- Splits each page or chapter into individual sentences
- Highlights the sentence currently being spoken with a distinct visual treatment
- Auto-scrolls the view to keep the active sentence centered on screen
- Allows clicking or tapping any sentence to jump playback to that point

### Playback Controls

- Play / Pause toggle
- Skip forward by 5 sentences
- Skip backward by 5 sentences
- Jump to previous page or chapter
- Jump to next page or chapter
- Clickable progress bar showing position within the current page or chapter
- Current sentence count and total sentence count displayed alongside the progress bar

### Speed Control

- Adjustable playback speed with preset options: 0.75×, 1×, 1.25×, 1.5×, 2×
- Speed changes apply immediately, even during active playback
- The currently selected speed is visually indicated

### Voice Selection

- Displays a dropdown of all text-to-speech voices available in the user's browser
- Users can switch voices at any time, including during playback
- Defaults to an English voice when available

### Page Navigation Strip

- A horizontally scrollable strip of page or chapter tabs is visible at the top of the player screen
- The current page or chapter tab is visually highlighted
- Tapping any tab immediately switches to that page or chapter
- The strip automatically scrolls to keep the active tab visible
- Labels adapt to file type: "Pg 1, Pg 2…" for PDFs, chapter titles for EPUBs

### Navigation Between Screens

- From the contents screen, tapping any entry opens the player and begins reading that entry
- From the player screen, a back button returns to the contents screen
- From the contents screen, a "Change Book" button returns to the upload screen and resets all state
- Returning to the contents screen from the player stops playback

### Keyboard Shortcuts

- Space bar toggles play and pause
- Right arrow advances to the next sentence
- Left arrow returns to the previous sentence
- Keyboard shortcuts are only active on the player screen

---

## Privacy and Data Handling

- No files are uploaded to any server — all processing occurs in the browser
- No user data is stored, tracked, or transmitted
- No cookies, accounts, or analytics
- Closing the browser tab discards all data

---

## Accessibility Considerations

- The core purpose of the app is an accessibility feature: converting visual text to audio
- Sentence highlighting provides a visual anchor for users following along
- The interface uses high-contrast colors and clear interactive targets
- Playback controls are always visible and reachable without scrolling

---

## Out of Scope (v1)

- Bookmarking or saving reading position between sessions
- Cloud storage or syncing across devices
- Support for file formats beyond PDF and EPUB (e.g., MOBI, DJVU, TXT)
- User accounts or profiles
- Custom theme or appearance settings
- Offline use via service worker / PWA
- Integration with external TTS engines or AI voices
- Annotation, highlighting, or note-taking on the text
- Mobile app distribution via app stores

---

## Success Criteria

- A user can go from uploading a file to hearing it read aloud in under 10 seconds for a typical document
- All pages of a 200-page PDF are individually listed and navigable
- Playback continues seamlessly across page or chapter boundaries without user intervention
- The app works without any installation, login, or configuration
