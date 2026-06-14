import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cek token saat app pertama kali dibuka
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            fetchMe();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchMe = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data.data);
        } catch {
            localStorage.removeItem("access_token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        const res = await api.post("/auth/register", { name, email, password });
        return res.data;
    };

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        const { access_token, user } = res.data.data;
        localStorage.setItem("access_token", access_token);
        setUser(user);
        return res.data;
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            localStorage.removeItem("access_token");
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
