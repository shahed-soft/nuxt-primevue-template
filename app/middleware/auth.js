
export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.client) {
        const {isAuthenticated} = useAuthStore();
        console.log('isAuthenticated', isAuthenticated);
        if (!isAuthenticated) return navigateTo('/auth/login');
    }
})
