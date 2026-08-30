import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ email: "", password: "" });

    const from = location.state?.from?.pathname || "/products";

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const result = await login(form.email, form.password);
        if (result.success) {
            navigate(from, { replace: true });
        }
    }

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit} className="auth-form">
                <h1>Iniciar sesión</h1>

                {error && <div className="form-error">{error}</div>}

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Contraseña
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Ingresando..." : "Ingresar"}
                </button>

                <p>
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </form>
        </div>
    );
}
