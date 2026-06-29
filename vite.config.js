import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Change 'cse-tracker' to your actual GitHub repo name
  base: '/cse-tracker/',
})
