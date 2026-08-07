// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import AstroPWA from '@vite-pwa/astro'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://text.oriz.in',
  output: 'static',
  integrations: [
    react(),
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'icons/*.png', 'icons/*.svg', 'screenshots/*'],
      manifest: {
        name: 'oriz Text',
        short_name: 'Text',
        id: '/',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        lang: 'en',
        dir: 'ltr',
        categories: ['productivity'],
        description:
          'Writing-desk text toolkit — case, counts, dedupe, sort, slugify, lorem, find & replace. 100% client-side.',
        background_color: '#f6f0e2',
        theme_color: '#b23a2e',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-256.png', sizes: '256x256', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
        screenshots: [
          {
            src: '/screenshots/desktop.png',
            sizes: '1280x800',
            type: 'image/png',
            form_factor: 'wide',
            label: 'oriz Text on desktop',
          },
          {
            src: '/screenshots/mobile.png',
            sizes: '390x844',
            type: 'image/png',
            label: 'oriz Text on mobile',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        navigateFallback: '/',
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              /(?:g4f|pollinations)/i.test(url.hostname) || /pollinations\.ai$/i.test(url.hostname),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'oz-ai-calls',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
