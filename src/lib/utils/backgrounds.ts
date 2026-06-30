// Background images live in src/lib/assets/backgrounds. import.meta.glob lets
// Vite bundle them (single hashed copy each) and gives us their resolved URLs.
// Drop a new image in that folder and it's picked up automatically.
const modules = import.meta.glob<string>('../assets/backgrounds/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const urls = Object.keys(modules)
  .sort()
  .map((path) => modules[path])

/** A random background URL, or undefined if there are none. Call once per load. */
export function randomBackgroundUrl(): string | undefined {
  if (urls.length === 0) return undefined
  return urls[Math.floor(Math.random() * urls.length)]
}
