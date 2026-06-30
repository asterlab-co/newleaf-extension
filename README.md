# newleaf

Custom new tab extension for Chrome.

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
