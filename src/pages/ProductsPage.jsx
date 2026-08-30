import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/endpoints";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    if (loading) return <p className="state-msg">Cargando productos...</p>;
    if (error) return <p className="state-msg state-msg--error">{error}</p>;

    return (
        <div className="products-page">
            <h1>Productos</h1>
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        {product.imageUrl && (
                            <img src={product.imageUrl} alt={product.name} />
                        )}
                        <Link to={`/products/${product.id}`}>
                            <h3>{product.name}</h3>
                        </Link>
                        <p className="product-card__price">${product.price}</p>
                        {isAuthenticated ? (
                            <button onClick={() => addItem(product.id, 1)}>
                                Agregar al carrito
                            </button>
                        ) : (
                            <Link to="/login" className="button-link">
                                Inicia sesión para comprar
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
