// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import VitePWA from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  // Уберем site URL пока сайт не развернут
  // site: 'https://cybernattor.github.io',
  integrations: [tailwind(), VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,avif}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.example\.com\/.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
      ],
    },
    manifest: {
      name: 'bit Tecnologies',
      short_name: 'bit',
      description: 'bit Tecnologies - Professional Web Development',
      theme_color: '#000000',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })],
  i18n: {
    defaultLocale: "ru",
    locales: ["ru", "en"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  output: "static",
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro'],
            router: ['astro:components/client'],
            ui: ['@astrojs/tailwind']
          }
        }
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug']
        }
      },
      chunkSizeWarningLimit: 1000,
      // Optimize assets
      assetsInlineLimit: 4096
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['astro', '@astrojs/tailwind']
    }
  },
  build: {
    format: 'directory',
    assets: 'assets'
  },
  image: {
    serviceEntry: true,
    domains: ['cybernattor.github.io']
  },
  dev: {
    port: 4321,
    host: true
  }
});