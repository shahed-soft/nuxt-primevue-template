// Composable for fetching paginated data with search and filters
import {ref, watch, computed} from 'vue'
import {useDataFetch} from "~/composables/useDataFetch.js";

export function usePaginatedDataFetch(url, initialFilters = {}, perPage = 10) {
    // Combine pagination composable
    const page = ref(1)
    const total = ref(0)
    const lastPage = ref(1)
    const rowsOptions = ref([5, 10, 20, 50, 100])
    const totalPages = computed(() => lastPage.value || 1)
    const rowCount = ref(perPage);
    const nextPage = () => {
        if (page.value < totalPages.value) page.value++
    }
    const prevPage = () => {
        if (page.value > 1) page.value--
    }

    const setPage = (meta) => {
        console.log('Setting page', meta);
        rowCount.value = meta.rows ?? rowCount.value;
        let selectedPage = meta.page + 1;
        if (selectedPage >= 1 && selectedPage <= totalPages.value) page.value = selectedPage;
    }

    // Add search & filter support
    const search = ref('')
    const filters = ref({...initialFilters})

    // Computed params for API calls
    const params = computed(() => ({
        ...filters.value,
        search: search.value || undefined,
        page: page.value,
        per_page: rowCount.value,
    }))

    // Use generic fetch composable
    const {fetchedData, metaData, loading, error, refetch} = useDataFetch(toValue(url), {
        params: params,
        immediate: false,
    })

    // Internal fetch handler
    const fetchData = async () => {
        await refetch()
        if (fetchedData.value) {
            total.value = metaData.value.total || 0
            lastPage.value = metaData.value.last_page || 1
        }
    }

    // Refetch automatically when dependencies change
    watch([page, rowCount, search, filters], fetchData, {deep: true, immediate: false})

    // Reset pagination on filter/search change
    watch([search, filters], () => setPage({page: 0}))

    // Initial fetch
    // fetchData()

    // Helper methods for filters
    const setFilter = (key, value) => {
        filters.value[key] = value
    }

    const resetFilters = () => {
        filters.value = {...initialFilters}
        search.value = ''
        setPage({page: 0})
    }


    return {
        // Data
        items: fetchedData,
        loading,
        error,

        // Pagination
        pagination: {
            page,
            total,
            lastPage,
            nextPage,
            prevPage,
            setPage,
            rowCount,
            rowsOptions
        },

        // Search & Filters
        search,
        filters,
        setFilter,
        resetFilters,

        // Methods
        fetchData,
    }
}
