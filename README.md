# newleaf: a calmer new tab.

Every new tab is a fresh start. Instead of clutter and distractions, newleaf gives you a clean, beautiful space designed to help you focus.

newleaf replaces Chrome's default new tab page with a simple dashboard that puts the essentials front and center.

Features

- Clock & date: Keep track of time at a glance with customizable formats, including 12- or 24-hour time and flexible date styles.
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
  characters. Make it sell the features (clock, date, quick links) rather than
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
  stored only in `localStorage` and never leave the browser. Fonts and
  background photos are bundled, so the extension makes no external network
  requests at all — declare "does not collect user data."
- **Privacy policy URL** — required if you handle any user data. A short policy
  stating that links stay in `localStorage` is enough.

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

## Future improvements

### Adding search back

An early version shipped a search box that submitted directly to Google. The
Chrome Web Store **rejected it under the Single Purpose policy** (violation code
"Red Argon"): a new-tab extension that *also* ships its own hardcoded search is
treated as bundling two purposes, and as ignoring whichever default search
engine the user has chosen. So the feature was removed.

If we want to bring search back, a plain form posting to Google is **not** an
option — it would be rejected again. It has to be done the way Chrome sanctions:

- **Route queries through the [`chrome.search`](https://developer.chrome.com/docs/extensions/reference/api/search)
  API** (`chrome.search.query({ text, disposition: 'NEW_TAB' })`) instead of a
  hardcoded URL. This sends the query to the user's *own* default search engine,
  which is exactly what the policy requires. The new tab page is an extension
  page, so it can call the API directly — no background/service worker needed.
- **Add the `"search"` permission** to [`public/manifest.json`](public/manifest.json).
  This is the tradeoff: it's a small, low-risk permission, but it breaks the
  current "**no permissions**" promise that the manifest description, README, and
  privacy policy all lean on.
- **Update the copy** if this ships: the manifest description, the Features list
  above, [`PRIVACY.md`](PRIVACY.md), and [`privacy.html`](privacy.html) would all
  need the "no permissions / no network requests" wording revised, and the
  Privacy practices declaration in the Web Store dashboard updated accordingly.

In short, it's a deliberate product decision (keep the zero-permission,
zero-network story vs. offer engine-respecting search), not a quick re-add.
See the constraint note in [`CLAUDE.md`](CLAUDE.md) for the short version.
