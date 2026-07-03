// Quick link model and URL helpers shared by the settings editor and the
// dashboard display.

export interface QuickLink {
  id: string
  label: string
  url: string
  /** Background color (#rrggbb) for the link's initial badge. */
  color: string
  /** Epoch ms the link was added; used for the "recently added"/"oldest" sorts. */
  addedAt: number
}

/** Cap on stored quick links. Storage could hold thousands, but the
 *  dashboard's wrapping link rows and the settings list degrade well before
 *  that — this keeps the worst case bounded. */
export const MAX_QUICK_LINKS = 50;

/** Preset badge colors: 12 light pastels, hues ascending from 0 to 359. Hex
 *  because `<input type="color">` only accepts #rrggbb. */
export const LINK_COLOR_PRESETS: string[] = Array.from({ length: 12 }, (_, i) =>
  hslToHex(i * 30, 55, 78),
)

/** A random preset for a new link's initial badge. */
export function randomLinkColor(): string {
  return LINK_COLOR_PRESETS[Math.floor(Math.random() * LINK_COLOR_PRESETS.length)]
}

/** Whether dark text is more legible than light text on this #rrggbb color. */
export function isLightColor(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 0xff
  const g = (n >> 8) & 0xff
  const b = n & 0xff
  // Perceived luminance (ITU-R BT.601), 0–255.
  return 0.299 * r + 0.587 * g + 0.114 * b > 145
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100
  const ln = l / 100
  const a = sn * Math.min(ln, 1 - ln)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    const c = ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${channel(0)}${channel(8)}${channel(4)}`
}

/** How quick links are arranged for display. */
export type LinkSort = 'custom' | 'alpha' | 'recent' | 'oldest'

/** Sort modes in menu order (first is the default), with the labels shown to
 *  the user. */
export const LINK_SORTS: { id: LinkSort; label: string }[] = [
  { id: 'alpha', label: 'Sort alphabetically (A–Z)' },
  { id: 'recent', label: 'Recently added' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'custom', label: 'Custom order' },
]

/** Name shown for a link: its label, or the hostname when no label was given. */
export function displayName(link: QuickLink): string {
  return link.label || hostname(link.url)
}

/** Return links arranged for display. "Custom" keeps the stored (manual) order. */
export function sortLinks(links: QuickLink[], sort: LinkSort): QuickLink[] {
  switch (sort) {
    case 'alpha':
      return [...links].sort((a, b) => displayName(a).localeCompare(displayName(b)))
    case 'recent':
      return [...links].sort((a, b) => b.addedAt - a.addedAt)
    case 'oldest':
      return [...links].sort((a, b) => a.addedAt - b.addedAt)
    case 'custom':
    default:
      return links
  }
}

/** Whether a (normalized) URL string parses as a valid absolute URL. */
export function isValidUrl(url: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return false
  }
  // Chrome's URL parser percent-encodes spaces in hosts instead of rejecting
  // them ("https://not a url" parses with host "not%20a%20url"), so catch
  // that explicitly — a host with an encoded space is never what the user
  // meant. Spaces later in the URL (paths, queries) are fine.
  return !parsed.host.includes('%20')
}

/** Ensure a user-entered URL has a protocol so it resolves as an absolute link. */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  // Already has a scheme (https://, chrome://, file://, etc.) — leave as-is.
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

/** Best-effort display name for a URL: its hostname without a leading "www.". */
export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
