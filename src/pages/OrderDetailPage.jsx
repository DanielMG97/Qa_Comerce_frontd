import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/endpoints";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function fetchOrder() {
      setLoading(true);
      try {
        const { data } = await getOrderById(id);
        if (active) setOrder(data);
      } catch (err) {
        if (active) setError("No se pudo cargar el detalle de la orden.");
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchOrder();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <p className="state-msg">Cargando orden...</p>;
  if (error) return <p className="state-msg state-msg--error">{error}</p>;
  if (!order) return null;

  return (
    <div className="order-detail">
      <Link to="/orders">&larr; Volver a órdenes</Link>
      <h1>Orden #{order.id}</h1>
      <p>Estado: {order.status || "Procesada"}</p>
      <p>Total: ${order.total}</p>

      <h3>Envío</h3>
      <p>
        {order.firstName} {order.lastName}
        <br />
        {order.address}, {order.city}, {order.postalCode}
        <br />
        {order.country} — {order.phone}
      </p>

      {order.items && (
        <>
          <h3>Productos</h3>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.productName || item.name} x{item.quantity} — $
                {item.price}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
