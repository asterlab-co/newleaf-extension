// Quick link model and URL helpers shared by the settings editor and the
// dashboard display.

export interface QuickLink {
  id: string
  label: string
  url: string
  /** Epoch ms the link was added; used for the "recently added"/"oldest" sorts. */
  addedAt: number
}

/** How quick links are arranged for display. */
export type LinkSort = 'custom' | 'alpha' | 'recent' | 'oldest'

/** Sort modes in menu order, with the labels shown to the user. */
export const LINK_SORTS: { id: LinkSort; label: string }[] = [
  { id: 'custom', label: 'Custom order' },
  { id: 'alpha', label: 'Alphabetical (A–Z)' },
  { id: 'recent', label: 'Recently added' },
  { id: 'oldest', label: 'Oldest first' },
]

/** Return links arranged for display. "Custom" keeps the stored (manual) order. */
export function sortLinks(links: QuickLink[], sort: LinkSort): QuickLink[] {
  switch (sort) {
    case 'alpha':
      return [...links].sort((a, b) => a.label.localeCompare(b.label))
    case 'recent':
      return [...links].sort((a, b) => b.addedAt - a.addedAt)
    case 'oldest':
      return [...links].sort((a, b) => a.addedAt - b.addedAt)
    case 'custom':
    default:
      return links
  }
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

/** URL of the site's favicon, resolved through Google's favicon service. */
export function faviconUrl(url: string): string {
  try {
    const host = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`
  } catch {
    return ''
  }
}
