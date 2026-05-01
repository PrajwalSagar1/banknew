import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
    withCredentials: true,
});

// Request Interceptor: Attach Access Token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Token Refresh
API.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                // Use a clean axios instance to avoid interceptor conflict
                const response = await axios.post(
                    `${API.defaults.baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    const { accessToken } = response.data.data;

                    // Save the new token
                    localStorage.setItem('accessToken', accessToken);

                    // Update the original request header and retry
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return API(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed (e.g., refresh token expired)
                console.error('Refresh token expired or invalid:', refreshError);

                // Auto Logout logic
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');

                // Redirect to login if on the client
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;
