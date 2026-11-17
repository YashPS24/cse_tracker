import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Live CSE data
// The CSE API (www.cse.lk/api) refuses requests coming from other websites, so a browser page can't call it
// directly, and the public GitHub Pages site has no server of its own. When you run the app on your own
// computer (npm run dev), Vite forwards /cse-api/* to https://www.cse.lk/api/* from your machine, just like
// visiting cse.lk yourself. That is what makes live prices and announcements work locally.
const cseProxy = {
  '/cse-api': {
    target: 'https://www.cse.lk',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/cse-api/, '/api'),
    configure: (proxy) => {
      proxy.on('proxyReq', (req) => {
        req.removeHeader('origin') // a request from your own machine, not from another website
        req.removeHeader('referer')
      })
    },
  },
}

export default defineConfig({
  plugins: [react()],
  // Must match the GitHub repository name: the site is served from https://<user>.github.io/cse_tracker/
  base: '/cse_tracker/',
  server: { proxy: cseProxy },
  preview: { proxy: cseProxy },
})
