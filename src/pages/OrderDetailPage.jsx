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
    <div className="order-detail" data-testid="order-detail-page">
      <Link to="/orders" data-testid="order-detail-back-link">&larr; Volver a órdenes</Link>
      <h1 data-testid="order-detail-id">Orden #{order.id}</h1>
      <p data-testid="order-detail-status">Estado: {order.status || "Procesada"}</p>
      <p data-testid="order-detail-total">Total: S/{order.total}</p>

      <h3 data-testid="order-detail-shipping-title">Envío</h3>
      <p data-testid="order-detail-shipping-address">
        {order.firstName} {order.lastName}
        <br />
        {order.address}, {order.city}, {order.postalCode}
        <br />
        {order.country} — {order.phone}
      </p>

      {order.items && (
        <>
          <h3>Productos</h3>
          <ul data-testid="order-detail-items">
            {order.items.map((item) => {
              const productName =
                item.product?.name ?? item.productName ?? item.name ?? "Producto";
              const productPrice = item.product?.price ?? item.price ?? 0;

              return (
                <li key={item.id} data-testid={`order-detail-item-${item.id}`}>
                  {productName} x{item.quantity} — S/{productPrice}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
