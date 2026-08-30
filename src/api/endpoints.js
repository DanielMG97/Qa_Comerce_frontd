import api from "./client";

// ---- Auth ----
export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);

// ---- Perfil ----
export const getProfile = () => api.get("/profile");

// ---- Productos ----
export const getProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);

// ---- Carrito ----
export const getCart = () => api.get("/cart");
export const addToCart = (data) => api.post("/cart/add", data);
export const updateCartItem = (data) => api.put("/cart/update", data);
export const removeCartItem = (itemId) => api.delete(`/cart/remove/${itemId}`);

// ---- Checkout / Órdenes ----
export const checkout = (data) => api.post("/checkout", data);
export const getOrders = () => api.get("/orders");
export const getOrderById = (id) => api.get(`/orders/${id}`);
