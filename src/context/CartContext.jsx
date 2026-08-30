import { createContext, useContext, useState, useCallback } from "react";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
} from "../api/endpoints";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshCart = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        setError(null);
        try {
            const { data } = await getCart();
            setCart(data);
        } catch (err) {
            setError("No se pudo cargar el carrito.");
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    async function addItem(productId, quantity = 1) {
        setLoading(true);
        setError(null);
        try {
            await addToCart({ productId, quantity });
            await refreshCart();
            return { success: true };
        } catch (err) {
            setError("No se pudo agregar el producto al carrito.");
            return { success: false };
        } finally {
            setLoading(false);
        }
    }

    async function updateItem(itemId, quantity) {
        setLoading(true);
        setError(null);
        try {
            await updateCartItem({ itemId, quantity });
            await refreshCart();
            return { success: true };
        } catch (err) {
            setError("No se pudo actualizar la cantidad.");
            return { success: false };
        } finally {
            setLoading(false);
        }
    }

    async function removeItem(itemId) {
        setLoading(true);
        setError(null);
        try {
            await removeCartItem(itemId);
            await refreshCart();
            return { success: true };
        } catch (err) {
            setError("No se pudo eliminar el producto.");
            return { success: false };
        } finally {
            setLoading(false);
        }
    }

    const value = {
        cart,
        loading,
        error,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
    return ctx;
}
