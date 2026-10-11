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
        <div className="checkout-page" data-testid="checkout-page">
            <h1>Checkout</h1>

            <form onSubmit={handleSubmit} className="checkout-form" data-testid="checkout-form">
                {error && (
                    <div className="form-error" data-testid="checkout-error">
                        {error}
                    </div>
                )}

                <label>
                    Nombre
                    <input
                        id="checkout-first-name"
                        data-testid="checkout-first-name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Apellido
                    <input
                        id="checkout-last-name"
                        data-testid="checkout-last-name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Dirección
                    <input
                        id="checkout-address"
                        data-testid="checkout-address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Ciudad
                    <input
                        id="checkout-city"
                        data-testid="checkout-city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Código postal
                    <input
                        id="checkout-postal-code"
                        data-testid="checkout-postal-code"
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    País
                    <input
                        id="checkout-country"
                        data-testid="checkout-country"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Teléfono
                    <input
                        id="checkout-phone"
                        data-testid="checkout-phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" data-testid="checkout-submit" disabled={loading}>
                    {loading ? "Procesando..." : "Confirmar compra"}
                </button>
            </form>
        </div>
    );
}
