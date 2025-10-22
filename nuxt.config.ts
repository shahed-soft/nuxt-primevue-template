// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            baseApi: process.env.NUXT_PUBLIC_API_BASE || 'http://lms-api.test/api/v1',
        },
    },
    app: {
        baseURL: '/',
        head: {
            title: 'LMS', // default fallback title
            link: [{ rel: 'manifest', href: '/manifest.webmanifest' }],
        },
    },
    modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@primevue/nuxt-module', '@vite-pwa/nuxt'],
    primevue: {
        options: {
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: "[class*=\"app-dark\"]",
                },
            },
            ripple: true,
        },
        autoImport: true,
        components: {
            include: '*',
            exclude: ['Editor', 'Galleria', 'Carousel', 'chart', 'FullCalendar'],
        }
    },
    css: ['~/assets/sass/app.scss'],
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    tailwindcss: {
        configPath: 'tailwind.config.ts',
    },
    pwa: {
        registerType: 'autoUpdate', // automatically update service worker
        manifest: {
            name: 'LMS App',
            short_name: 'LMS',
            start_url: '/',
            display: 'standalone',
            theme_color: '#4F46E5',
            background_color: '#ffffff',
            icons: [
                { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
                { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
            ],
        },
        devOptions: {
            enabled: true,  // allows /dev-sw.js in development
            type: 'module',
            suppressWarnings: true,
        },
    },
})