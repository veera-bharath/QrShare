# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

QrShare is a **Chrome Extension (Manifest V3)** built with React + TypeScript + Vite. It generates styled QR codes for the current tab URL, selected text, links, and images via context menus.

## Commands

```bash
npm run dev       # Start Vite dev server (browser preview mode, no extension APIs)
npm run build     # TypeScript check + Vite build → dist/
npm run lint      # ESLint
npm run preview   # Preview the built output
```

The built extension lives in `dist/`. Load it in Chrome via `chrome://extensions` → "Load unpacked" → select `dist/`.

**Dev mode caveat**: The popup runs without Chrome APIs in dev mode. It falls back to `localStorage` for storage and uses `?url=` query param to seed input (defaults to `https://github.com`).

## Architecture

### Two build entry points (configured in `vite.config.ts`)
- **`index.html` → popup** — The React UI (360px fixed-width panel)
- **`src/background/serviceWorker.ts` → `background.js`** — MV3 service worker, registers context menus and relays clicked content to the popup via `chrome.storage.local`

### Popup data flow
1. `App.tsx` on mount: checks `chrome.storage.local` for `pendingQRText` (set by service worker on context menu click), falls back to active tab URL
2. `useQRStore` (Zustand + `persist`) stores `history` and `qrStyle` in Chrome storage (falls back to `localStorage` in dev)
3. `setCurrentText` auto-runs `contentDetector.detect()` and updates `detectedType`
4. `QRViewer` watches `currentText`, `qrStyle`, and `detectedType`; calls `qrRenderer.render()` on a `<canvas>`, then exports the canvas as a data URL

### QR rendering pipeline (`src/utils/qrRenderer.ts`)
- Uses `qrcode` library to get the raw bit-matrix at error correction level `H`
- Draws manually on a 512×512 canvas: body dots, finder pattern corners, and a center logo region
- Center logo is **content-aware**: URL → globe, email → envelope, phone → mobile outline, wifi → arc waves, text → brand icon (`/icon-128.png`)
- `dotType` and `cornerType` in `QRStyle` control square vs. rounded rendering

### Storage abstraction
- `src/storage/storageService.ts` — thin wrapper used for one-off reads/writes (not store persistence)
- `src/store/useQRStore.ts` defines its own `chromeStorage` adapter for Zustand `persist` middleware; both implementations guard `typeof chrome !== 'undefined'`

### Styling
- Tailwind CSS v4 with custom theme tokens in `src/popup/index.css` (`--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-accent`)
- Dark-only design; accent color is Chrome Material Blue (`#8ab4f8`)
- Font: Outfit (Google Fonts)

## Key Files

| File | Role |
|------|------|
| `src/store/useQRStore.ts` | Central state — history, QR style, detected type, loading |
| `src/utils/qrRenderer.ts` | All canvas drawing logic |
| `src/utils/contentDetector.ts` | Classifies input as `url \| email \| phone \| wifi \| text` |
| `src/background/serviceWorker.ts` | Context menu registration and popup trigger |
| `public/manifest.json` | Extension manifest (MV3), permissions, keyboard shortcut |
| `src/popup/index.css` | Tailwind theme tokens + custom animations |

## Zustand Store Notes

- Store key is `qrshare-store-v3` — increment if the persisted schema changes
- Only `history` (max 10 items, deduped by text) and `qrStyle` are persisted; ephemeral state (`currentText`, `qrDataUrl`, `isLoading`) resets on each popup open
- `setCurrentText` is the only setter that also triggers side-effects (content detection)
