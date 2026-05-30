# QrShare - Modern QR Code Generator Chrome Extension

**QrShare** is a production-ready, beautiful, and feature-rich Chrome Extension (Manifest V3) that allows users to instantly generate, copy, and download high-resolution QR codes for custom texts, selections, links, or current tab URLs.

Built with a modern web stack utilizing **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **Zustand** state persistence.

---

## ✨ Features

- ⚡ **Instant Active Tab QR**: Popup automatically generates a QR code for your current tab URL upon launch (filters out internal `chrome://` or `edge://` pages).
- ✍️ **Custom Live Input**: Textarea for manual text, URLs, or paragraphs with a live preview, character counter, and debounced generation to maintain UI performance.
- 🎨 **Adaptive Color Themes**: Cohesive light and dark themes using custom design variables that automatically update the QR code's foreground and background colors to blend into the container.
- 🛠 **Frictionless Action Triggers**:
  - **Copy Image**: Copies the QR code canvas image blob directly to your system clipboard using the modern `navigator.clipboard.write` API for fast pasting into Slack, Discord, email, or documents.
  - **Copy Text**: Fast clipboard utility to copy the original text contents of the active QR.
  - **Download**: Prompts a local high-resolution PNG download with clean filenames reflecting domain hosts or content snippets.
  - **Expand**: Triggers an immersive fullscreen modal overlay for quick scanning across distances or screens.
  - **Toast Notifications**: Smooth status alerts confirming action triggers.
- 📜 **Stored History Panel**: Keeps a sliding list of the last 10 generated items with relative timestamps ("2m ago"), duplicate filtration (bubbles duplicate generations to the top), single-click re-generation, and deletion.
- 🖱 **Context Menu Integration**: Right-click selections or links in any web page to choose "Generate QR Code". Automatically opens the extension or flags a high-visibility badge fallback (`"NEW"`).

---

## 🛠 Tech Stack

- **Core**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, PostCSS, Lucide React (Icons), Outfit Google Typography
- **State & Storage**: Zustand (State Store with customized asynchronous `chrome.storage.local` persistence middleware)
- **Bundler**: Vite 8 (Rollup custom multi-entry configuration for splitting the popup UI and the background service worker)
- **QR Engine**: `qrcode` (highly reliable ISO/IEC 18004 specification generator)

---

## 📂 Project Structure

```text
QrShare/
├── dist/                  # Compiled production build output
├── public/                # Static public assets (resized icons, manifest.json)
│   ├── manifest.json      # Chrome Extension Manifest V3
│   ├── icon-16.png        # Extension icon (16x16)
│   ├── icon-32.png        # Extension icon (32x32)
│   ├── icon-48.png        # Extension icon (48x48)
│   └── icon-128.png       # Extension icon (128x128)
├── src/
│   ├── background/
│   │   └── serviceWorker.ts  # Background worker & Context Menus handler
│   ├── popup/
│   │   ├── components/
│   │   │   ├── ActionsBar.tsx    # Download, copy, and fullscreen actions
│   │   │   ├── HistoryPanel.tsx  # Dynamic list of recent QR codes
│   │   │   ├── InputSection.tsx  # Debounced custom textarea input
│   │   │   ├── QRViewer.tsx      # Main QR viewer, loaders, and error states
│   │   │   └── ThemeToggle.tsx   # Light/dark mode variables toggler
│   │   ├── App.tsx       # Main React app shell & active tab querying logic
│   │   ├── index.css     # CSS Variables, keyframe animations, & Tailwind v4
│   │   └── main.tsx      # React popup app mount script
│   ├── storage/
│   │   └── storageService.ts # Standardized storage wrapper with web fallback
│   ├── store/
│   │   └── useQRStore.ts     # Zustand store persisted with Chrome storage API
│   ├── types/
│   │   └── qr.ts             # Domain typescript interfaces
│   └── utils/
│       └── qrGenerator.ts    # QR code generator wrapper
├── index.html             # Vite entrypoint HTML file
├── postcss.config.js      # PostCSS Tailwind plugins config
├── tailwind.config.js     # Tailwind v4 configuration file
├── tsconfig.json          # TypeScript workspace definitions
├── tsconfig.app.json      # TypeScript compiler app instructions
└── vite.config.ts         # Vite bundler & Rollup multiple-entrypoint engine
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v18+) and npm installed.

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/veera-bharath/QrShare.git
   cd QrShare
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

### Development & Production Build

To compile the TypeScript source files and bundle styling assets into the `/dist` output folder:
```bash
npm run build
```

---

## ⚙️ How to Load in Google Chrome

Once the build completes and creates the `/dist` directory, you can load it natively in Chrome:

1. Open **Google Chrome** and navigate to `chrome://extensions/`.
2. Turn on the **Developer mode** toggle in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the `/dist` directory inside the repository:
   `d:\Projects\QrShare\dist`
5. Pin **QrShare** to your extension bar and enjoy!
