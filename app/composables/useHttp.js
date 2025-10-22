
export const useHttp = () => {
    const { $api } = useNuxtApp()

    const httpGet = (url, params) => $api(url, { method: 'GET', params })
    const httpPost = (url, body) => $api(url, { method: 'POST', body })
    const httpPatch = (url, body) => $api(url, { method: 'PATCH', body })
    const httpDelete = (url) => $api(url, { method: 'DELETE' })

    return { httpGet, httpPost, httpPatch, httpDelete }
}
