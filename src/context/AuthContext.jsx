import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    async function login(email, password) {
        setLoading(true);
        setError(null);
        try {
            const { data } = await loginUser({ email, password });
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            const message =
                err.response?.data?.message || "Credenciales inválidas. Intenta de nuevo.";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }

    async function register(formData) {
        setLoading(true);
        setError(null);
        try {
            await registerUser(formData);
            // Tras registrar, iniciamos sesión automáticamente
            return await login(formData.email, formData.password);
        } catch (err) {
            const message =
                err.response?.data?.message || "No se pudo completar el registro.";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        setToken(null);
        setUser(null);
    }

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        loading,
        error,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
}
