import axios from "axios";

const api = axios.create({
    baseURL: "https://athrsyd.pythonanywhere.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Otomatis sisipkan token di setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Jika data adalah FormData, hapus Content-Type agar axios set boundary otomatis
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }
    return config;
});

export default api;
