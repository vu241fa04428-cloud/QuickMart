import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  async function refresh() {
    if (!user) { setItems([]); return; }
    try { const { data } = await api.get("/cart"); setItems(data.items || []); }
    catch { setItems([]); }
  }

  useEffect(() => { refresh(); }, [user]);

  async function add(productId, quantity = 1) {
    await api.post("/cart", { productId, quantity });
    await refresh();
  }
  async function update(productId, quantity) {
    await api.patch(`/cart/${productId}`, { quantity });
    await refresh();
  }
  async function remove(productId) {
    await api.delete(`/cart/${productId}`);
    await refresh();
  }

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  return <CartContext.Provider value={{ items, count, total, refresh, add, update, remove }}>{children}</CartContext.Provider>;
}
