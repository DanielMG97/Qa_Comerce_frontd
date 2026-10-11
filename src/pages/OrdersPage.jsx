import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/endpoints";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        async function fetchOrders() {
            try {
                const { data } = await getOrders();
                if (active) setOrders(data);
            } catch (err) {
                if (active) setError("No se pudieron cargar tus órdenes.");
            } finally {
                if (active) setLoading(false);
            }
        }
        fetchOrders();
        return () => {
            active = false;
        };
    }, []);

    if (loading) return <p className="state-msg">Cargando órdenes...</p>;
    if (error) return <p className="state-msg state-msg--error">{error}</p>;

    return (
        <div className="orders-page" data-testid="orders-page">
            <h1>Tus órdenes</h1>

            {orders.length === 0 ? (
                <p data-testid="orders-empty-message">
                    Aún no tienes órdenes. <Link to="/products">Ver productos</Link>
                </p>
            ) : (
                <div className="orders-list" data-testid="orders-list">
                    {orders.map((order) => (
                        <Link
                            key={order.id}
                            to={`/orders/${order.id}`}
                            className="order-card"
                            data-testid={`order-card-${order.id}`}
                        >
                            <span data-testid={`order-id-${order.id}`}>Orden #{order.id}</span>
                            <span data-testid={`order-status-${order.id}`}>{order.status || "Procesada"}</span>
                            <span data-testid={`order-total-${order.id}`}>S/{order.total}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
