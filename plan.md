# newleaf — improvement & feature plan

Recommendations captured for later review. The codebase is already well-crafted
(thoughtful comments, careful edge-case handling, good a11y, graceful
`localStorage` degradation), so these fill real gaps rather than fix sloppiness.

Two rails to preserve throughout: **no new permissions** and **no network
calls** — the core product promise. And **no built-in search box** (Chrome Web
Store rejected it under the Single Purpose policy).

---

## Codebase improvements (priority order)

### 1. Add a test suite for the pure logic  — highest leverage
`npm run check` (types only) is currently the sole gate; there's no way to catch
a regression in URL handling. `src/lib/utils/links.ts` and `time.ts` are pure
functions with tricky, already-documented edge cases:
- `normalizeUrl`, `isValidUrl` (incl. the encoded-space `%20` host trap)
- `sortLinks`, `displayName`, `hostname`
- `isLightColor`, `hslToHex`

Vitest fits a Vite project with near-zero config. Start with `links.ts`.

### 2. Keyboard accessibility for link reordering
Custom-order drag-and-drop in `LinksSettings.svelte` is pointer-only — no
keyboard path to reorder, an a11y gap in an otherwise meticulous UI. Add up/down
move buttons on the drag handle, or arrow-key handling when the handle is
focused.

### 3. Reduce background flash on load
`Dashboard.svelte` picks a random AVIF and paints it; a cold new-tab can flash
before decode. Add a solid fallback background color behind the image (a calm
default, or one sampled per image) and/or handle `fetchpriority`/decode. Cheap
polish that matters because it's the first thing seen on every new tab.

### 4. Minor cleanups
- Duplicate `border-radius: 1.25rem;` in `LinksSettings.svelte` (`.link` rule).
- `settings.svelte.ts` re-serializes the entire settings object on any change —
  fine at this scale; revisit only if settings grow large.

---

## Next features (priority order)

### 1. Settings export / import (JSON)  — build first
User data (quick links + preferences) lives only in one browser's
`localStorage` — lost on reinstall, new machine, or profile wipe. A
download-JSON / upload-JSON pair in Settings solves the biggest real user pain
without touching the zero-permissions promise.

### 2. Background controls
Currently fully random per load with no user agency. Low-risk, client-side
additions: a "shuffle" button, "keep this one" (pin the current image), or a
preference filter (e.g. light/dark). No new permissions.

### 3. Greeting / focus line
Optional "Good morning" (time is already computed) or a user-set
intention/name line under the clock. Fits the calm-dashboard purpose; still a
single-purpose new-tab page.

### 4. Link favicons — carefully (low priority)
Option to show a site's favicon instead of the colored initial. **Caveat:** the
obvious implementation (favicon service / hitting the site) is a network request
and would **break the no-network promise**. Only viable from a bundled/local
icon set or Chrome's own cache — a deliberate, documented tradeoff, not a casual
add. Ranked low for this reason.

---

## Guardrails (do not cross without a deliberate decision)
- No search box (Single Purpose policy rejection).
- No entry in manifest `permissions` — keep it empty.
- Zero network requests; fonts stay self-hosted.
- Bump `version` in **both** `manifest.json` and `package.json` on release.
