import axios from "axios"

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api")
    .replace(/\/+$/, "")

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true
})

let refreshPromise

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config
        const requestUrl = originalRequest?.url || ""
        const isAuthRequest = /^\/users\/(login|register|refresh|logout)(\/|$)/.test(requestUrl)

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !isAuthRequest
        ) {
            originalRequest._retry = true

            try {
                if (!refreshPromise) {
                    refreshPromise = axiosInstance.post("/users/refresh")
                        .finally(() => {
                            refreshPromise = undefined
                        })
                }

                await refreshPromise
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                if (
                    typeof window !== "undefined" &&
                    [401, 403].includes(refreshError.response?.status)
                ) {
                    window.dispatchEvent(new Event("auth:expired"))
                }
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance