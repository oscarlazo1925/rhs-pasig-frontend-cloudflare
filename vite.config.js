import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // always get latest SW
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'RHS Pasig',
        short_name: 'RHS Pasig',
        description: 'RHS Pasig Frontend App',
        theme_color: '#c59400',
        background_color: '#e7cf86',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/rhslogo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/rhslogo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/rhslogo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // precache all static assets (JS, CSS, HTML)
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],

        // runtime caching (API, images, etc.)
        runtimeCaching: [
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            // Cache images
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            // Cache API requests (your backend)
            urlPattern: /^https:\/\/rhs-backend\.vercel\.app\/.*$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  base: '/',
})
