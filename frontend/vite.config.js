import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),

        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [], // keine icons nötig
            manifest: {
                name: 'Vue CRUD',
                short_name: 'CRUD',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#ffffff',
                // icons absichtlich leer (überwiegend ok)
                icons: []
            },
            workbox: {
                // basic offline für build assets
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            },
        }),
    ],
    resolve: {
        alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
})