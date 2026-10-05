import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/icon.svg', 'img/*.jpg'],
      manifest: {
        name: 'Smart Siembro Colombia',
        short_name: 'Siembro',
        description: 'Cultivos rentables, pastos y clima para agricultores y ganaderos de Colombia. Funciona sin internet.',
        lang: 'es-CO',
        theme_color: '#0f6b3a',
        background_color: '#f3f7f2',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Todo el contenido (datos, fotos, JS, CSS) se precachea: la app funciona 100% sin internet tras la primera visita.
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,json,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Clima en vivo: intenta red, cae a caché
            urlPattern: /^https:\/\/(api|archive-api)\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'clima-open-meteo', networkTimeoutSeconds: 6, expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          }
        ]
      }
    })
  ],
  test: { environment: 'node', include: ['src/**/*.test.ts'] }
});
