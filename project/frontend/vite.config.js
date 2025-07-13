import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Use standard target for better compatibility
    target: 'es2015',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Simple chunk splitting
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        },
        // Standard chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Standard settings
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    reportCompressedSize: false,
    // Enable CSS code splitting for consistency
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  // Standard dev server
  server: {
    host: true,
    port: 3000,
  },
  // Standard dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Standard esbuild settings
  esbuild: {
    target: 'es2015',
    // Standard minification
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  // Standard CSS processing
  css: {
    postcss: {
      plugins: [],
    },
    modules: false,
  },
})
