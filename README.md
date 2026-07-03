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


## Background images

The bundled background images are AI-generated (created with Google's Nano
Banana Pro model). No attribution is required, and they are free to use,
modify, and redistribute along with the rest of this repository.
