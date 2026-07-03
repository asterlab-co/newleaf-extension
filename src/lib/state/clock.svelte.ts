// A single shared "now" that ticks once a second, so the clock display and the
// settings previews stay in sync off one timer.
export const clock = $state({ now: new Date() })

// Schedule each tick for the next second boundary (rather than a fixed
// interval) so the display flips exactly when the wall clock does.
function tick() {
  clock.now = new Date()
  setTimeout(tick, 1000 - (Date.now() % 1000))
}
tick()
