import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // allows access from network
  },
  preview: {
    host: '0.0.0.0', // required for Render preview
    port: 4173,       // default Vite preview port
    strictPort: false,
    allowedHosts: ['epilogue-frontend.onrender.com'], // add your deployed frontend host here
  },
})