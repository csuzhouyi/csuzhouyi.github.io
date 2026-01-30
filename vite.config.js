import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/csuzhouyi.github.io/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
