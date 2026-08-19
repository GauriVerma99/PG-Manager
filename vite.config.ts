import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'firebase/auth': path.resolve(__dirname, './src/firebase/mock.ts'),
      'firebase/firestore': path.resolve(__dirname, './src/firebase/mock.ts')
    }
  }
})
