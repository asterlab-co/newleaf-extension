import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
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
