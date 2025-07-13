import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize for mobile performance
    target: 'esnext',
    minify: 'esbuild', // Use esbuild instead of terser
    rollupOptions: {
      output: {
        // Optimize chunk splitting
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          leaflet: ['leaflet'],
          socket: ['socket.io-client'],
        },
        // Optimize chunk names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      // Aggressive tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    // Optimize bundle size
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    // Reduce unused code
    reportCompressedSize: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Optimize assets
    assetsInlineLimit: 4096,
  },
  // Optimize dev server
  server: {
    host: true,
    port: 3000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['socket.io-client'], // Exclude from pre-bundling
  },
  // Performance optimizations
  esbuild: {
    target: 'esnext',
    // Aggressive minification
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    // Remove console and debugger
    drop: ['console', 'debugger'],
  },
  // Define global constants
  define: {
    __DEV__: false,
  },
})
