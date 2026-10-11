import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    // Calcula el total de ítems acumulados en el carrito
    const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <nav className="navbar" data-testid="navbar">
            <Link id="nav-home" data-testid="nav-home" to="/products" className="navbar__brand">
                QACommerce
            </Link>
            <div className="navbar__links">
                <Link id="nav-products" data-testid="nav-products" to="/products">Productos</Link>

                {isAuthenticated && (
                    <Link
                        id="nav-cart"
                        data-testid="nav-cart"
                        to="/cart"
                        style={{ display: "inline-flex", alignItems: "center" }}
                    >
                        Carrito
                        {totalItems > 0 && (
                            <span
                                id="nav-cart-count"
                                data-testid="nav-cart-count"
                                style={{
                                    marginLeft: "6px",
                                    backgroundColor: "#0bbef5",
                                    color: "#000000",
                                    fontSize: "0.75rem",
                                    fontWeight: "bold",
                                    padding: "2px 6px",
                                    borderRadius: "10px"
                                }}
                            >
                                {totalItems}
                            </span>
                        )}
                    </Link>
                )}

                {isAuthenticated && (
                    <Link id="nav-orders" data-testid="nav-orders" to="/orders">Órdenes</Link>
                )}
                {isAuthenticated && (
                    <Link id="nav-profile" data-testid="nav-profile" to="/profile">Perfil</Link>
                )}

                {isAuthenticated ? (
                    <>
                        <span id="nav-user-display" data-testid="nav-user-display" className="navbar__user">
                            {user?.firstName || user?.email}
                        </span>
                        <button id="logout-btn" data-testid="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
                    </>
                ) : (
                    <>
                        <Link id="nav-login" data-testid="nav-login" to="/login">Iniciar sesión</Link>
                        <Link id="nav-register" data-testid="nav-register" to="/register">Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
}