import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
};

export default function RegisterPage() {
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [localError, setLocalError] = useState(null);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLocalError(null);

        if (form.password !== form.confirmPassword) {
            setLocalError("Las contraseñas no coinciden.");
            return;
        }

        const result = await register(form);
        if (result.success) {
            navigate("/products", { replace: true });
        }
    }

    return (
        <div className="auth-page" data-testid="register-page">
            <form onSubmit={handleSubmit} className="auth-form" data-testid="register-form">
                <h1>Crear cuenta</h1>

                {(localError || error) && (
                    <div className="form-error" data-testid="register-error">
                        {localError || error}
                    </div>
                )}

                <label>
                    Nombre
                    <input
                        id="register-first-name"
                        data-testid="register-first-name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Apellido
                    <input
                        id="register-last-name"
                        data-testid="register-last-name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Email
                    <input
                        id="register-email"
                        data-testid="register-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Teléfono
                    <input
                        id="register-phone"
                        data-testid="register-phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Contraseña
                    <input
                        id="register-password"
                        data-testid="register-password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Confirmar contraseña
                    <input
                        id="register-confirm-password"
                        data-testid="register-confirm-password"
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" data-testid="register-submit" disabled={loading}>
                    {loading ? "Creando cuenta..." : "Registrarme"}
                </button>

                <p>
                    ¿Ya tienes cuenta? <Link data-testid="register-login-link" to="/login">Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
}
