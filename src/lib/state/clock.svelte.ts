// A single shared "now" that ticks once a second, so the clock display and the
// settings previews stay in sync off one timer.
export const clock = $state({ now: new Date() })

setInterval(() => {
  clock.now = new Date()
}, 1000)
