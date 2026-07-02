# TODO

Improvement suggestions from a code review (2026-07-02), grouped by priority.

## Visual / UX polish

- [ ] **1. Convert backgrounds from PNG to WebP/AVIF.** The 16 PNGs total ~13 MB —
      nearly the whole extension package. AVIF at quality ~60 would land around
      1–2 MB total. `src/lib/utils/backgrounds.ts` already globs `webp`/`avif`,
      so it's purely an asset swap.
- [ ] **2. Protect text legibility over bright backgrounds.** On a pale-sky image the
      thin uppercase date can wash out. Add a subtle `text-shadow` or a
      low-opacity scrim gradient behind the dashboard content.

## Code quality / robustness

- [ ] **3. Add a small Vitest suite for the pure utils.** `time.ts` and `links.ts`
      have real edge cases (12h rollover at midnight/noon, `normalizeUrl`, the
      `addedAt` backfill in settings `load()`). The settings migration logic
      especially deserves coverage since a regression there silently loses user
      data.
- [ ] **4. Make link reordering keyboard-accessible.** Drag-and-drop in
      `src/lib/layouts/settings/LinksSettings.svelte` is mouse-only. Add
      move up/down actions (e.g. ArrowUp/ArrowDown on the focused drag handle).
- [ ] **5. Wire `aria-controls` on the settings tabs.** Panels in
      `src/lib/layouts/settings/Settings.svelte` have `aria-labelledby`
      back-references, but the tabs lack `aria-controls` and the panels lack
      `id`s — the one missing piece of an otherwise textbook ARIA tabs pattern.
- [ ] **6. Align the clock tick to the second boundary.** `src/lib/state/clock.svelte.ts`
      uses a bare `setInterval(1000)`, so the display can lag real time by up to a
      second. Schedule each tick with `setTimeout(1000 - Date.now() % 1000)` so
      the clock flips exactly on the second — noticeable when seconds are shown.

## Product ideas (compatible with the zero-permission promise)

- [ ] **7. Export/import links as JSON.** Everything lives in `localStorage`, so
      reinstalling or switching machines silently wipes a user's links. A
      client-side download/upload button in settings needs no permissions and
      removes the scariest failure mode. (True sync would need
      `chrome.storage.sync` + the `storage` permission — a documented off-limits
      tradeoff; export/import gets most of the value without it.)
- [ ] **8. Add a "Background" settings tab.** Even just "shuffle every tab vs. pick
      one favorite" would be a natural fourth tab next to Date/Time/Links, using
      infrastructure that already exists.
