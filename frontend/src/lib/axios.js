import axios from "axios"

const axiosInstance= axios.create({
    baseURL: import.meta.env.MODE==="development"?"http://localhost:5000/api":"/api",
    withCredentials:true, //send cookies to the server
})

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = () => {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            originalRequest.url !== "/auth/refresh-token"
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh(() => {
                        axiosInstance(originalRequest).then(resolve).catch(reject);
                    });
                });
            }

            isRefreshing = true;
            try {
                await axiosInstance.post("/auth/refresh-token");
                isRefreshing = false;
                onRefreshed();
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                refreshSubscribers = [];
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;

