import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../api/endpoints";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addItem } = useCart();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        let active = true;
        async function fetchProduct() {
            setLoading(true);
            try {
                const { data } = await getProductById(id);
                if (active) setProduct(data);
            } catch (err) {
                if (active) setError("Producto no encontrado.");
            } finally {
                if (active) setLoading(false);
            }
        }
        fetchProduct();
        return () => {
            active = false;
        };
    }, [id]);

    if (loading) return <p className="state-msg">Cargando producto...</p>;
    if (error) return <p className="state-msg state-msg--error">{error}</p>;
    if (!product) return null;

    return (
        <div className="product-detail">
            <Link to="/products">&larr; Volver a productos</Link>
            <h1>{product.name}</h1>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
            <p>{product.description}</p>
            <p className="product-detail__price">${product.price}</p>

            {isAuthenticated ? (
                <div className="product-detail__actions">
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    <button onClick={() => addItem(product.id, quantity)}>
                        Agregar al carrito
                    </button>
                </div>
            ) : (
                <Link to="/login" className="button-link">
                    Inicia sesión para comprar
                </Link>
            )}
        </div>
    );
}
