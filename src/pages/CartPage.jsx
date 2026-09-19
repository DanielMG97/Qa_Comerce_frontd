import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
    const { cart, loading, error, refreshCart, updateItem, removeItem } =
        useCart();
    const navigate = useNavigate();

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const items = cart?.items || [];
    const total =
        cart?.total ??
        items.reduce(
            (sum, item) => sum + ((item.product?.price ?? item.price ?? 0) * item.quantity),
            0
        );

    if (loading && !cart) return <p className="state-msg">Cargando carrito...</p>;

    return (
        <div className="cart-page">
            <h1>Tu carrito</h1>

            {error && <div className="form-error">{error}</div>}

            {items.length === 0 ? (
                <p>
                    Tu carrito está vacío. <Link to="/products">Ver productos</Link>
                </p>
            ) : (
                <>
                    <div className="cart-list">
                        {items.map((item) => {
                            const productName =
                                item.product?.name ?? item.productName ?? item.name ?? "Producto";
                            const productPrice = item.product?.price ?? item.price ?? 0;

                            return (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item__info">
                                        <h3>{productName}</h3>
                                        <p>S/ {productPrice}</p>
                                    </div>
                                    <div className="cart-item__actions">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(item.id, Number(e.target.value))
                                            }
                                        />
                                        <button onClick={() => removeItem(item.id)}>Eliminar</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <p>
                            Total: <strong>S/ {total}</strong>
                        </p>
                        <button onClick={() => navigate("/checkout")}>
                            Ir a checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
