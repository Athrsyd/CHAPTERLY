import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const savedUser = localStorage.getItem("user");
        if (token && savedUser) {
            try { setUser(JSON.parse(savedUser)); } catch { }
        }
        setLoading(false);
    }, []);

    const register = async (name, email, password) => {
        const res = await api.post("/auth/register", { name, email, password });
        return res.data;
    };

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        const { token, user } = res.data.data;
        localStorage.setItem("access_token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
