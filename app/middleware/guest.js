
export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.client) {
        const {isAuthenticated} = useAuthStore();
        if (isAuthenticated) return navigateTo('/');
    }
})
