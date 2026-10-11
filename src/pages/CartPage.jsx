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
        <div className="cart-page" data-testid="cart-page">
            <h1>Tu carrito</h1>

            {error && <div className="form-error" data-testid="cart-error">{error}</div>}

            {items.length === 0 ? (
                <p data-testid="cart-empty-message">
                    Tu carrito está vacío. <Link to="/products">Ver productos</Link>
                </p>
            ) : (
                <>
                    <div className="cart-list" data-testid="cart-list">
                        {items.map((item) => {
                            const productName =
                                item.product?.name ?? item.productName ?? item.name ?? "Producto";
                            const productPrice = item.product?.price ?? item.price ?? 0;

                            return (
                                <div
                                    key={item.id}
                                    className="cart-item"
                                    data-testid={`cart-item-${item.id}`}
                                >
                                    <div className="cart-item__info">
                                        <h3 data-testid={`cart-item-name-${item.id}`}>{productName}</h3>
                                        <p data-testid={`cart-item-price-${item.id}`}>S/ {productPrice}</p>
                                    </div>
                                    <div className="cart-item__actions">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            data-testid={`cart-item-quantity-${item.id}`}
                                            onChange={(e) =>
                                                updateItem(item.id, Number(e.target.value))
                                            }
                                        />
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            data-testid={`cart-item-remove-${item.id}`}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary" data-testid="cart-summary">
                        <p data-testid="cart-total">
                            Total: <strong>S/ {total}</strong>
                        </p>
                        <button onClick={() => navigate("/checkout")} data-testid="cart-checkout-btn">
                            Ir a checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
