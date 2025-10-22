import {storage} from '~/utils/storageUtils'
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const token = storage.token.get();

    const api = $fetch.create({
        baseURL: config.public.baseApi,
        credentials: 'omit', // For token auth

        async onRequest({ options }) {
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

            if (token) {
                headers.Authorization = `Bearer ${token}`
            }

            options.headers = { ...options.headers, ...headers }
        },

        async onResponse({ response }) {
            // Optional: Log successful requests in dev
            if (process.dev) {
                console.log('✅', response.url, response.status)
            }
        },

        async onResponseError({ request, response, options }) {
            // Global error handling
            console.error('❌', request, response.status, response.body)

            if (response.status === 401) {
                // Clear auth and redirect
                storage.token.remove()
                const authStore = useAuthStore()
                authStore.user.value = null
                navigateTo('auth/login')
            }

            if (response.status === 419) {
                // CSRF token mismatch
                console.error('CSRF token mismatch')
            }
        },
    })

    return {
        provide: {
            api,
        },
    }
})