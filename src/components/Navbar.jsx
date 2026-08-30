import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <Link to="/products" className="navbar__brand">
                QACommerce
            </Link>
            <div className="navbar__links">
                <Link to="/products">Productos</Link>
                {isAuthenticated && <Link to="/cart">Carrito</Link>}
                {isAuthenticated && <Link to="/orders">Órdenes</Link>}
                {isAuthenticated && <Link to="/profile">Perfil</Link>}
                {isAuthenticated ? (
                    <>
                        <span className="navbar__user">{user?.firstName || user?.email}</span>
                        <button onClick={handleLogout}>Cerrar sesión</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Iniciar sesión</Link>
                        <Link to="/register">Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
