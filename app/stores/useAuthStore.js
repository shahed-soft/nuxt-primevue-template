import {ref} from 'vue'
import {storage} from '~/utils/storageUtils'

export const useAuthStore = defineStore('auth', () => {

    const user = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const token = computed(() => storage.token.get())
    const isAuthenticated = computed(() => !!token.value)
    const {httpGet, httpPost} = useHttp();

    async function login(username, password) {
        error.value = null
        try {
            loading.value = true
            const {data, success} = await httpPost(`auth/login`, {username, password});
            storage.token.set(data.token);
            user.value = data.user
            return {success: success, user: data.user, message: data.message || 'Login successful'};
        } catch (e) {
            error.value = e.data
            return {success: false, errors: e.data?.errors, message: e.data?.message || 'Login failed'};
        } finally {
            loading.value = false
        }
    }

    async function fetchUser() {
        if (!token.value) return
        try {
            const {data} = await httpGet(`auth/user`)
            user.value = data.user;
            return {success: success, user: data.user, message: data.message || 'User fetched successfully'};
        } catch (e) {
            error.value = e.data
            return {success: false, errors: e.data?.errors, message: e.data?.message || 'Fetch user failed'};
        }
    }

    async function logout() {
        loading.value = true;
        if (!token.value) return;
        try {
            const {data, success} = await httpPost(`auth/logout`);
            if (success) {
                user.value = null;
                storage.token.remove()
                return {success: true, message: 'User logged out'};
            }
            return {success: false, message: 'Logout failed'};
        } catch (e) {
            error.value = e.data
            return {success: false, errors: e.data?.errors, message: e.data?.message || 'Logout failed'};
        } finally {
            loading.value = false
        }

    }

    return {isAuthenticated, user, loading, error, login, fetchUser, logout}
})
