import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/ProfilePage";

import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <Navbar />
                    <main className="app-container">
                        <Routes>
                            {/* Rutas públicas */}
                            <Route path="/" element={<Navigate to="/products" replace />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/products/:id" element={<ProductDetailPage />} />

                            {/* Rutas protegidas (requieren JWT) */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/orders" element={<OrdersPage />} />
                                <Route path="/orders/:id" element={<OrderDetailPage />} />
                            </Route>

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/products" replace />} />
                        </Routes>
                    </main>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}