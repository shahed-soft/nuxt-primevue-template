// A composable to fetch data from an API endpoint with loading and error states.
import { ref, watchEffect } from 'vue'

export function useDataFetch(url, options = {}) {
    const {httpGet} = useHttp();
    const fetchedData = ref(null)
    const metaData = ref(null)
    const error = ref(null)
    const loading = ref(false)
    const fetchUrl = toValue(url)
    const fetchData = async () => {
        if (!fetchUrl) return
        loading.value = true
        error.value = null
        try {
            const {data, meta} = await httpGet(fetchUrl, toValue(options.params) || {})
            console.log('Fetched data from', fetchUrl, data);
            fetchedData.value = data
            metaData.value = meta
        } catch (err) {
            error.value = err.data
        } finally {
            loading.value = false
        }
    }

    // Auto-fetch when URL or params change
    watchEffect(() => {
        if (options.immediate !== false) {
            fetchData();
        }
    })

    return {
        fetchedData,
        metaData,
        error,
        loading,
        refetch: fetchData,
    }
}
