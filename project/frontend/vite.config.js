import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared')
    }
  },
  server: {
    host: true, // 👈 THIS LINE ALLOWS connections from your phone
    port: 5173  // (optional, default is 5173 anyway)
  }
})
