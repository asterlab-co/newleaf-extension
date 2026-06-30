# newleaf: a calmer new tab.

Every new tab is a fresh start. Instead of clutter and distractions, newleaf gives you a clean, beautiful space designed to help you focus.

newleaf replaces Chrome's default new tab page with a simple dashboard that puts the essentials front and center.

Features

- Clock & date: Keep track of time at a glance with customizable formats, including 12- or 24-hour time and flexible date styles.
- Quick search: Search the web directly from your new tab.
- Your links: Save your favorite websites and access them with a single click.
- Beautiful backgrounds: Enjoy a calming nature photo every time you open a new tab.
- Simple settings: Personalize your experience with an easy-to-use settings panel.

Private by design

newleaf requests no permissions and collects no data. Your links are stored locally in your browser and never leave your device.

Free, lightweight, and distraction-free. A new tab, thoughtfully simplified.


## Development

Run the app in the browser with hot-reloading (not as an extension):

```sh
npm install
npm run dev
```

This is the fastest way to iterate on the UI. To test it as an actual Chrome
extension, build it and load the output (see below).


## Testing as a Chrome extension locally

The manifest lives at [`public/manifest.json`](public/manifest.json) and is
copied into the build output as-is.

1. Build the extension:

   ```sh
   npm run build
   ```

   This outputs the unpacked extension to `dist/`.

2. Open Chrome and go to `chrome://extensions`.

3. Enable **Developer mode** (toggle in the top-right corner).

4. Click **Load unpacked** and select the `dist/` folder.

5. Open a new tab — you should see the newleaf page instead of Chrome's default.

After making changes, re-run `npm run build`, then click the **reload** (↻)
icon on the newleaf card in `chrome://extensions` and open a new tab again.

> Note: another extension already overriding the new tab page will conflict with
> this one. Chrome uses whichever new-tab override is enabled.

## Icons

Extension icons must be **PNG** (SVG is not supported in the manifest). Provide
these sizes:

| Size | Used for |
|------|----------|
| 16×16 | Favicon, context menus |
| 32×32 | Windows display |
| 48×48 | Extensions management page (`chrome://extensions`) |
| 128×128 | Installation and the Chrome Web Store (effectively required) |

Chrome will downscale from a larger icon, so 128×128 is the only strictly
required size — but supplying each size avoids blurry scaling.

Place the PNGs in `public/icons/` (copied as-is to `dist/`) and reference them
in [`public/manifest.json`](public/manifest.json):

```json
"icons": {
  "16": "icons/icon-16.png",
  "32": "icons/icon-32.png",
  "48": "icons/icon-48.png",
  "128": "icons/icon-128.png"
}
```

## Chrome Web Store submission checklist

### Manifest polish

- **Bump the `version`** to a real release number (e.g. `1.0.0`). Each upload
  must have a higher version than the last.
- **Tighten the `description`** — it appears in the store and is limited to 132
  characters. Make it sell the features (clock, search, quick links) rather than
  the generic placeholder.
- **Consider `author` / homepage** fields, and `"minimum_chrome_version"` if you
  later rely on newer APIs (not needed currently).
- **Keep permissions empty.** The extension requests none, which is ideal and
  speeds up review. Only add one if a feature requires it (e.g. the `favicon`
  permission for Chrome's built-in `_favicon/` API).

### Store listing assets

These are uploaded in the Web Store dashboard, not in the manifest.

- **Screenshots** — at least one, 1280×800 or 640×400 PNG/JPEG. Practically
  required; listings without them look broken.
- **128×128 store icon** — already provided in `public/icons/`.
- **Promo tile (optional)** — 440×280, plus a detailed listing description.
- **Privacy practices** — the dashboard makes you declare data usage. Links are
  stored only in `localStorage` and never leave the browser, **except** that the
  favicon helper sends each saved link's hostname to Google's favicon service.
  Either disclose that, or switch to Chrome's built-in `_favicon/` API (needs the
  `favicon` permission) to avoid the third-party call.
- **Privacy policy URL** — required if you handle any user data. A short policy
  stating that links stay in `localStorage` (plus the favicon note above) is
  enough.

### Packaging

- The store wants a **ZIP of the `dist/` contents** (zip the files, not a parent
  folder), not a `.crx`:

  ```sh
  npm run build
  cd dist && zip -r ../newleaf.zip . && cd ..
  ```

- A one-time **$5 developer registration fee** is required for the Chrome Web
  Store account.

### Quality (recommended, not required)

- Add a **`LICENSE`** file if open-sourcing.
- Test in a **clean Chrome profile** to confirm no console errors and that the
  `chrome://` quick-link behavior works as the installed extension.
