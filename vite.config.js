import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                // target: 'http://localhost:3000',
                target: 'https://lyn-backend-165954-5-1362504576.sh.run.tcloudbase.com',
                changeOrigin: true,
                timeout: 300000 // 5分钟超时，确保AI接口有足够时间响应
            }
        }
    }
});
