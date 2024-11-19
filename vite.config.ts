import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@device': path.resolve(__dirname, 'src/device'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@navigation': path.resolve(__dirname, 'src/navigation'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@skeletons': path.resolve(__dirname, 'src/skeletons'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@src': path.resolve(__dirname, 'src')
    },
    dedupe: ['@tiptap/core', '@tiptap/react']
  },
  server: {
    proxy: {
      "/api": {
        target: "https://me.dev.fedr.club",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
    }
  },
  optimizeDeps: {
    include: [
      '@tiptap/extension-document',
      '@tiptap/extension-mention',
      '@tiptap/extension-paragraph',
      '@tiptap/extension-text',
      '@tiptap/extension-image',
      '@tiptap/extension-bold',
      '@tiptap/extension-italic',
      '@tiptap/extension-strike',
      '@tiptap/extension-link',
      '@tiptap/html'
    ]
  }
})