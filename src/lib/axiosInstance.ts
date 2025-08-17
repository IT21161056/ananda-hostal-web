import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

// if (!API_URL) {
//   throw new Error("VITE_API_URL is not defined in environment variables");
// }

const API_URL = "https://ananda-hostal-api-4bd6e03768d8.herokuapp.com/api/v1";

// const API_URL = "http://localhost:5001/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      return Promise.reject(new Error("No internet connection"));
    }

    // Add auth token to headers if available
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await axios.get(`${API_URL}/auth/refresh`, {
          withCredentials: true,
        });

        const { accessToken } = response.data;

        // Store the new token
        localStorage.setItem("accessToken", accessToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        // Dispatch a custom event that the app can listen to
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
