import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// Mock 模式专用配置：不加载 vitePlugin（避免 RefreshRuntime 初始化顺序问题）
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    cors: true,
    open: '/index.html',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});
