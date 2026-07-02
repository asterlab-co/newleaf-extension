# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

newleaf is a Chrome extension (Manifest V3) that replaces the browser's new tab
page with a calm dashboard: clock/date and user-saved quick links over a random
nature background. It's a Svelte 5 + TypeScript + Vite SPA. There is no backend
and no build-time server — everything runs client-side and all user data lives
in `localStorage`.

## Commands

```sh
npm install
npm run dev      # Vite dev server with HMR — fastest way to iterate on the UI
npm run build    # outputs the unpacked extension to dist/
npm run preview  # serve the production build
npm run check    # svelte-check + tsc type checking (no test suite exists)
```

There are no tests, linter, or formatter configured. `npm run check` is the
only static gate.

### Testing as a real extension

`npm run dev` runs the app as a plain web page, which does not exercise the
`chrome://` new-tab override or installed-extension behavior. To test that:
`npm run build`, then in `chrome://extensions` enable Developer mode → **Load
unpacked** → select `dist/`. After changes, rebuild and click reload (↻) on the
extension card. See [README.md](README.md) for the full walkthrough and the
Chrome Web Store submission checklist.

## Architecture

- **Two build entry points** ([vite.config.ts](vite.config.ts)): `index.html`
  (the new tab app, mounted via [src/main.ts](src/main.ts)) and `privacy.html`
  (a standalone privacy page). The extension manifest lives at
  [public/manifest.json](public/manifest.json) and is copied into `dist/` as-is;
  it points `chrome_url_overrides.newtab` at `index.html`. Bump `version` in
  **both** `manifest.json` and `package.json` for a release.

- **Top-level view state** is a single `$state` in [src/App.svelte](src/App.svelte)
  toggling between the `Dashboard` and the `Settings` drawer — no router.

- **Reactive global state** uses Svelte 5 runes in `.svelte.ts` files under
  [src/lib/state/](src/lib/state/):
  - `settings.svelte.ts` — the single source of truth for all user
    preferences and quick links. It's a `$state` object loaded from and
    auto-persisted to `localStorage` (key `newleaf:settings`) via an
    `$effect.root`. `load()` merges over `defaults` and backfills missing
    fields, so **adding a new setting means adding it to the `Settings`
    interface and `defaults`**; old stored data stays compatible.
  - `clock.svelte.ts` — one shared `now` ticking each second so the clock and
    settings previews share a single timer.

- **Pure logic in [src/lib/utils/](src/lib/utils/)** is kept separate from
  components: `time.ts` (date/time formatting + the option sets the UI offers),
  `links.ts` (QuickLink model, sorting, URL normalization), and
  `backgrounds.ts`.

- **Backgrounds** are bundled from `src/lib/assets/backgrounds/` via
  `import.meta.glob`. Dropping an image file into that folder is enough — it's
  picked up automatically and one random URL is chosen per page load.

- **UI layers**: `src/lib/layouts/` holds the two screen compositions
  (`dashboard/`, `settings/`); `src/lib/components/` holds reusable pieces. Both
  re-export through barrel `index.ts` files, so import from `../lib/components`
  and `../lib/layouts` rather than deep paths. **Favor composing from components:
  reuse an existing component from `src/lib/components/` whenever one fits, and
  when adding new markup that could recur, extract it into a component rather
  than inlining it.**

- **Styling**: global CSS only, no component libraries. [src/styles/index.css](src/styles/index.css)
  imports base layers (`colors.css`, `fonts.css`, `global.css`); components use
  scoped `<style>` blocks. `phosphor-svelte` provides icons. **Order CSS
  properties alphabetically within every rule block** (both in the base
  stylesheets and in components' scoped `<style>` blocks).

## Constraints worth preserving

- **No permissions, no tracking, no network calls** — this is a core product
  promise (see [README.md](README.md) and [PRIVACY.md](PRIVACY.md)). The
  extension makes **zero** network requests: `permissions` must stay empty in
  the manifest, and nothing should talk to the network. Fonts are self-hosted
  (`public/fonts/`, wired up in [src/styles/base/fonts.css](src/styles/base/fonts.css)
  and again in [privacy.html](privacy.html)'s inline styles) specifically to
  avoid a runtime Google Fonts fetch — don't reintroduce a remote `@import`.

- **No built-in search box.** An earlier version shipped a search field that
  posted to Google. The Chrome Web Store rejected it under the Single Purpose
  policy ("Red Argon"): a new-tab extension that also provides its own search is
  treated as two bundled purposes and as ignoring the user's chosen default
  engine. Do not add a hardcoded search box back. If search is ever wanted, it
  must go through `chrome.search.query` (which respects the user's default
  engine) and requires adding the `"search"` permission — a deliberate tradeoff
  against the zero-permissions promise, not a casual change.
- All persistence must degrade gracefully when `localStorage` is unavailable or
  corrupt (private mode, quota) — the existing load/save code swallows those
  errors and falls back to defaults; follow that pattern.
