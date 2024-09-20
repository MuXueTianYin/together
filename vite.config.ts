import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  server: {
    port: 8000,
    proxy: {
      "/api": {
        target: " http://localhost:8080/api",
        /*
        * 线上地址
        * */
        // target: "https://muxuetianyin.cn/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})



