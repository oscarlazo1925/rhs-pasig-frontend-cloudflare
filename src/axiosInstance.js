// src/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Backend URL from .env
});

// 🔹 Request interceptor → attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response interceptor → handle expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired or unauthorized. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
