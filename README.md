# Sunset Deck Studio Prompt Generator

This is a browser-based React application built from your prompt generator component.

## What is included

- Vite-based React app scaffold
- Your prompt generator adapted into modular React components
- Export helpers for prompts and JSON payloads
- Collection mode, history, favorites, lockable slots, and negative prompt editing

## Main files

- `src/App.jsx` - top-level state and workflow wiring
- `src/data.js` - lane data and reusable constants
- `src/helpers.js` - prompt and listing builders
- `src/ControlsPanel.jsx`, `src/SlotCard.jsx`, `src/HistoryPanel.jsx`, `src/OutputCard.jsx` - UI sections

## Run locally

1. Install Node.js 20 or newer.
2. Open a terminal in `C:\Users\roman\OneDrive\Codex\sunset-deck-studio-app`.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL Vite prints in the terminal.

## Build for production

- Run `npm run build`
- The production files will be written to `dist`

## Notes

- I kept the app as a client-only React app so it runs directly in the browser.
- This environment does not currently have Node.js or npm installed, so dependency install and local runtime verification still need to happen on a machine with Node available.
