import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkout } from "../api/endpoints";
import { useCart } from "../context/CartContext";

const initialForm = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
};

export default function CheckoutPage() {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { refreshCart } = useCart();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data } = await checkout(form);
            await refreshCart();
            navigate(`/orders/${data.id}`, { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message || "No se pudo completar la orden."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>

            <form onSubmit={handleSubmit} className="checkout-form">
                {error && <div className="form-error">{error}</div>}

                <label>
                    Nombre
                    <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Apellido
                    <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Dirección
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Ciudad
                    <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Código postal
                    <input
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    País
                    <input
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Teléfono
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Procesando..." : "Confirmar compra"}
                </button>
            </form>
        </div>
    );
}
