// App-wide user settings, reactive and persisted to localStorage.
import type { DateFormatId, TimeFormat } from '../utils/time'
import type { QuickLink, LinkSort } from '../utils/links'

const STORAGE_KEY = 'newleaf:settings'

interface Settings {
  timeFormat: TimeFormat
  dateFormat: DateFormatId
  showClock: boolean
  showSeconds: boolean
  showDate: boolean
  showSearch: boolean
  showLinks: boolean
  quickLinks: QuickLink[]
  linkSort: LinkSort
}

const defaults: Settings = {
  timeFormat: '12h',
  dateFormat: 'dddd_mmmm_d_yyyy',
  showClock: true,
  showSeconds: false,
  showDate: true,
  showSearch: true,
  showLinks: true,
  quickLinks: [],
  linkSort: 'custom',
}

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const merged: Settings = { ...defaults, ...JSON.parse(raw) }
      // Backfill addedAt for links saved before timestamps existed, keeping
      // their stored order as the implied add order.
      merged.quickLinks = merged.quickLinks.map((link, i) => ({
        ...link,
        addedAt: typeof link.addedAt === 'number' ? link.addedAt : i,
      }))
      return merged
    }
  } catch {
    // Ignore unavailable/corrupt storage and fall back to defaults.
  }
  return { ...defaults }
}

export const settings = $state<Settings>(load())

// Persist whenever any setting changes.
$effect.root(() => {
  $effect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Ignore storage write failures (e.g. private mode quota).
    }
  })
})
