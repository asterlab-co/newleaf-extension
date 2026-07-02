// Pure time/date formatting helpers and the option sets the UI chooses from.

export type TimeFormat = '24h' | '12h';
export type DateFormatId =
  | 'dddd_mmmm_d_yyyy'
  | 'ddd_mmm_d_yyyy'
  | 'ddd_d_mmm_yyyy'
  | 'ddd_d_mmm'
  | 'mmm_d_yyyy'
  | 'd_mmm_yyyy';

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const pad = (n: number) => String(n).padStart(2, '0')

/** Returns the time (H:MM in 12h, HH:MM in 24h, with :SS when seconds are on)
 *  and a period ('' for 24h, 'AM'/'PM' for 12h). Hours are only zero-padded in
 *  24h mode — "9:41 AM" but "09:41". */
export function formatTime(
  date: Date,
  format: TimeFormat,
  showSeconds: boolean,
): { time: string; period: string } {
  let hours = date.getHours()
  let period = ''
  if (format === '12h') {
    period = hours < 12 ? 'AM' : 'PM'
    hours = hours % 12 || 12
  }
  const parts = [format === '12h' ? String(hours) : pad(hours), pad(date.getMinutes())]
  if (showSeconds) parts.push(pad(date.getSeconds()))
  return { time: parts.join(':'), period }
}

// One formatter per date format. Using a Record keeps it exhaustive: adding a
// DateFormatId without a formatter is a type error.
const dateFormatters: Record<DateFormatId, (d: Date) => string> = {
  // Monday, June 29, 2026
  dddd_mmmm_d_yyyy: (d) =>
    `${WEEKDAYS_LONG[d.getDay()]}, ${MONTHS_LONG[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
  // Mon, Jun 29, 2026
  ddd_mmm_d_yyyy: (d) =>
    `${WEEKDAYS_SHORT[d.getDay()]}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
  // Mon 29 Jun 2026
  ddd_d_mmm_yyyy: (d) =>
    `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`,
  // Mon 29 Jun
  ddd_d_mmm: (d) => `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`,
  // Jun 29, 2026
  mmm_d_yyyy: (d) => `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
  // 29 Jun 2026
  d_mmm_yyyy: (d) => `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`,
}

/** Date format ids in display order (first is the default). */
export const dateFormatIds = Object.keys(dateFormatters) as DateFormatId[]

export function formatDate(date: Date, format: DateFormatId): string {
  // Fall back to the default if a stale/unknown format id was persisted.
  const formatter = dateFormatters[format] ?? dateFormatters[dateFormatIds[0]]
  return formatter(date)
}
