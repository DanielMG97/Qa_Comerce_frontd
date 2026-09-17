import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/endpoints";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const { addItem } = useCart();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        let active = true;
        async function fetchProducts() {
            try {
                const { data } = await getProducts();
                if (active) setProducts(data);
            } catch (err) {
                if (active) setError("No se pudieron cargar los productos.");
            } finally {
                if (active) setLoading(false);
            }
        }
        fetchProducts();
        return () => {
            active = false;
        };
    }, []);

    const handleAddToCart = async (product) => {
        if (product.stock <= 0) return;

        try {
            await addItem(product.id, 1);
            setNotification(`¡"${product.name}" se agregó al carrito!`);
            setTimeout(() => setNotification(null), 3000);
        } catch (err) {
            setNotification("Error al agregar el producto al carrito.");
            setTimeout(() => setNotification(null), 3000);
        }
    };

    if (loading) return <p className="state-msg">Cargando productos...</p>;
    if (error) return <p className="state-msg state-msg--error">{error}</p>;

    return (
        <div className="products-page">
            {/* Mensaje de notificación flotante al añadir al carrito */}
            {notification && (
                <div
                    id="cart-notification-toast"
                    className="toast-notification"
                    style={{
                        position: "fixed",
                        top: "80px",
                        right: "24px",
                        backgroundColor: "#c69b2d",
                        color: "#0b0a0a",
                        padding: "12px 20px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        zIndex: 1000,
                        fontWeight: "600"
                    }}
                >
                    {notification}
                </div>
            )}

            <h1>Productos</h1>
            <div className="products-grid">
                {products.map((product) => {
                    const isOutOfStock = !product.stock || product.stock <= 0;

                    return (
                        <div
                            key={product.id}
                            id={`product-card-${product.id}`}
                            className="product-card"
                        >
                            {product.imageUrl && (
                                <img src={product.imageUrl} alt={product.name} />
                            )}
                            <Link to={`/products/${product.id}`}>
                                <h3 id={`product-name-${product.id}`}>{product.name}</h3>
                            </Link>

                            <p id={`product-price-${product.id}`} className="product-card__price">
                                ${product.price}
                            </p>

                            {/* Indicador de stock con validación visual */}
                            <p
                                id={`product-stock-${product.id}`}
                                className="product-card__stock"
                                style={{
                                    fontSize: "0.85rem",
                                    fontWeight: "600",
                                    color: isOutOfStock ? "#ef4444" : "#a1a1aa",
                                    marginBottom: "10px"
                                }}
                            >
                                {isOutOfStock ? "Sin stock disponible" : `Stock: ${product.stock}`}
                            </p>

                            {isAuthenticated ? (
                                <button
                                    id={`add-to-cart-btn-${product.id}`}
                                    onClick={() => handleAddToCart(product)}
                                    disabled={isOutOfStock}
                                    style={{
                                        cursor: isOutOfStock ? "not-allowed" : "pointer",
                                        opacity: isOutOfStock ? 0.5 : 1
                                    }}
                                >
                                    {isOutOfStock ? "Agotado" : "Agregar al carrito"}
                                </button>
                            ) : (
                                <Link to="/login" id={`login-to-buy-btn-${product.id}`} className="button-link">
                                    Inicia sesión para comprar
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}