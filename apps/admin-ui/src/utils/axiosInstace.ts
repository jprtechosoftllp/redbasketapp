import axios from "axios";

const axiosInstace = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL!,
    withCredentials: true
});

let isRefreshing = false;
let refreshSubscribers: (()=> void)[] = [];

// Handle logout and prevent infinte loops
const handleLogout = ()=> {
     if(window.location.pathname !== "/sign-in"){
        window.location.href = "/sign-in";
    }
};

// Handle adding a new access token to queued requests
const subscribeTokenRefresh = (callback: ()=> void)=> {
    refreshSubscribers.push(callback);
};

// Execute queued requests after refreshing
const onRefreshSuccess = ()=> {
    refreshSubscribers.forEach((callback)=> callback());
    refreshSubscribers = [];
}

// Request interceptor to add the access token to headers
axiosInstace.interceptors.request.use(
    (config: any)=> {
        const token = localStorage.getItem("accessToken");
        if(token && config.headers){
            config.headers["Authorization"] = 'Bearer ' + token;
        }
        return config;
    },

    (error: any)=> {
        return Promise.reject(error)
    }
)

// Response interceptor to handle 401 error and token refresh
axiosInstace.interceptors.response.use(
    (response)=> response,
    async (error)=> {
        const originalRequest = error.config;

        // If 401 error and not already trying to refresh
        if(error.response?.status === 401 && !originalRequest._retry){
            if(isRefreshing){
                return new Promise((resolve)=> {
                     subscribeTokenRefresh(()=> resolve(axiosInstace(originalRequest)))
                });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            // You may want to handle token refresh logic here
            // For now, just logout and reject
            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_URL!}/auth/admin/refresh-token`,
                    {},
                    { withCredentials : true}
                );

                isRefreshing = false;
                onRefreshSuccess();
                return axiosInstace(originalRequest)
            } catch (error) {
                isRefreshing = false;
                refreshSubscribers = [];
                handleLogout();
                return Promise.reject(error)
            }
        }
        return Promise.reject(error);
    }
)
export default axiosInstace;