import axios from "axios";

const BASE_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? "/api" : "http://localhost:3000/api");

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token dynamically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;