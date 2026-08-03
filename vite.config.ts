import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// public/ is copied into dist/ wholesale, gitignored files included, so macOS
// Finder metadata rides along into the uploaded extension package. Sweep it
// back out after the copy.
function stripFinderMetadata(): Plugin {
  return {
    name: 'strip-finder-metadata',
    closeBundle() {
      rmSync(resolve(__dirname, 'dist/.DS_Store'), { force: true })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), stripFinderMetadata()],
  resolve: {
    alias: {
      '@lib': resolve(__dirname, 'src/lib'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        // The new tab page (extension entry).
        main: resolve(__dirname, 'index.html'),
        // Standalone privacy policy page, served at /privacy.
        privacy: resolve(__dirname, 'privacy.html'),
      },
    },
  },
})
