// App-wide user settings, reactive and persisted to localStorage.
import type { DateFormatId, TimeFormat } from '../utils/time'
import { randomLinkColor, type QuickLink, type LinkSort } from '../utils/links'

const STORAGE_KEY = 'newleaf:settings'

interface Settings {
  timeFormat: TimeFormat
  dateFormat: DateFormatId
  showTime: boolean
  showSeconds: boolean
  showDate: boolean
  showLinks: boolean
  quickLinks: QuickLink[]
  linkSort: LinkSort
}

const defaults: Settings = {
  timeFormat: '12h',
  dateFormat: 'dddd_mmmm_d_yyyy',
  showTime: true,
  showSeconds: false,
  showDate: true,
  showLinks: true,
  quickLinks: [],
  linkSort: 'alpha',
}

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const stored = JSON.parse(raw)
      const merged: Settings = { ...defaults, ...stored }
      // Migrate the renamed visibility flag: showClock (≤0.0.3) → showTime.
      if (typeof stored.showTime !== 'boolean' && typeof stored.showClock === 'boolean') {
        merged.showTime = stored.showClock
      }
      delete (merged as unknown as Record<string, unknown>).showClock
      // Backfill fields links saved by older versions lack: addedAt (keeping
      // stored order as the implied add order) and the badge color.
      merged.quickLinks = merged.quickLinks.map((link, i) => ({
        ...link,
        addedAt: typeof link.addedAt === 'number' ? link.addedAt : i,
        color: typeof link.color === 'string' ? link.color : randomLinkColor(),
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
