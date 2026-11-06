import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { total, refresh } = useCart();
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError("");
    try { const { data } = await api.post("/orders", { deliveryAddress: address }); await refresh(); alert(`Order placed! Order ID: ${data._id}`); navigate("/orders"); }
    catch (err) { setError(err.response?.data?.message || "Could not place order."); }
    finally { setBusy(false); }
  }
  return <main className="auth-wrap"><form className="auth-card" onSubmit={submit}><span className="eyebrow">ALMOST THERE</span><h1>Checkout</h1><p>Total: <b>₹{total.toFixed(2)}</b></p>{error && <div className="error">{error}</div>}<label>Delivery address<textarea value={address} onChange={e => setAddress(e.target.value)} rows="4" required placeholder="House number, street, area, city, PIN code"/></label><label>Payment method<input value="Cash on Delivery (COD)" disabled/></label><button className="primary-btn full" disabled={busy}>{busy ? "Placing order..." : "Place order"}</button></form></main>;
}
