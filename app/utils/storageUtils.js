export const storage = {
    // Token management
    token: {
        get: () => {
            if (process.server) return null

            // Try cookie first
            const cookieToken = useCookie('auth_token').value
            if (cookieToken) return cookieToken

            // Fallback to localStorage
            if (process.client) {
                return localStorage.getItem('auth_token')
            }

            return null
        },

        set: (token) => {
            // Save to cookie
            const tokenCookie = useCookie('auth_token', {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            })
            tokenCookie.value = token

            // Also save to localStorage as backup
            if (process.client) {
                localStorage.setItem('auth_token', token)
            }
        },

        remove: () => {
            // Remove from cookie
            const tokenCookie = useCookie('auth_token')
            tokenCookie.value = null

            // Remove from localStorage
            if (process.client) {
                localStorage.removeItem('auth_token')
            }
        },
    },


    // Generic storage methods
    set: (key, value, options = {}) => {
        const storageType = options?.storage || 'both'

        if (storageType === 'cookie' || storageType === 'both') {
            const cookie = useCookie(key, {
                maxAge: options?.expiresIn || 60 * 60 * 24 * 7,
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            })
            cookie.value = typeof value === 'object' ? JSON.stringify(value) : value
        }

        if ((storageType === 'localStorage' || storageType === 'both') && process.client) {
            const stringValue = typeof value === 'object' ? JSON.stringify(value) : value
            localStorage.setItem(key, stringValue)
        }
    },

    get: (key, options = {}) => {
        const storageType = options?.storage || 'auto'

        if (storageType === 'cookie') {
            return useCookie(key).value
        }

        if (storageType === 'localStorage' && process.client) {
            const value = localStorage.getItem(key)
            try {
                return value ? JSON.parse(value) : null
            } catch {
                return value
            }
        }

        // Auto: try cookie first, then localStorage
        const cookieValue = useCookie(key).value
        if (cookieValue) return cookieValue

        if (process.client) {
            const localValue = localStorage.getItem(key)
            try {
                return localValue ? JSON.parse(localValue) : null
            } catch {
                return localValue
            }
        }

        return null
    },

    remove: (key, options = {}) => {
        const storageType = options?.storage || 'both'

        if (storageType === 'cookie' || storageType === 'both') {
            const cookie = useCookie(key)
            cookie.value = null
        }

        if ((storageType === 'localStorage' || storageType === 'both') && process.client) {
            localStorage.removeItem(key)
        }
    },

    // Clear all auth-related data
    clearAuth: () => {
        storage.token.remove();
    },

    // Clear everything
    clearAll: () => {
        if (process.client) {
            localStorage.clear()
        }
        // Note: Can't clear all cookies easily, so clear known ones
        storage.clearAuth()
    },
}