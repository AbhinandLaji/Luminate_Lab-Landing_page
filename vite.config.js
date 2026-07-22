import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    // Target modern browsers — smaller/faster bundles
    target: 'es2020',

    // Increase chunk warning threshold (framer-motion is large by nature)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manual chunk splitting for better cache hit rates
        manualChunks: {
          // Separate vendor chunk — won't change unless dep versions change
          'react-vendor': ['react', 'react-dom'],
          // Framer Motion is large (~150kb gzip) — isolate it
          'framer': ['framer-motion'],
        },
      },
    },

    // Generate sourcemaps for production debugging (optional: set to false to save space)
    sourcemap: false,

    // Report bundle sizes
    reportCompressedSize: true,
  },

  // Ensure /public assets are served correctly
  publicDir: 'public',
})
