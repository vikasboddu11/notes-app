import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "https://notes-app-backend-04dh.onrender.com/api",
    withCredentials: true
})

axiosInstance.interceptors.response.use(
    (res) => res,
    async(err) => {
        const originalRequest = err.config

        if (
            err.response &&
            err.response.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/users/refresh" &&
            !originalRequest.url.includes("/users/login") &&
            !originalRequest.url.includes("/users/register")
        ) {
            originalRequest._retry = true

            try {
                await axiosInstance.post("/users/refresh")
                return axiosInstance(originalRequest)
            } catch (error) {
                return Promise.reject(error)
            }
        }

        return Promise.reject(err)
    }
)

export default axiosInstance