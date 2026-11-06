import { useEffect, useState } from "react";
import api from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { api.get("/orders/my").then(r => setOrders(r.data)).catch(e => setError(e.response?.data?.message || "Could not load orders.")); }, []);
  return <main className="page"><span className="eyebrow">YOUR PURCHASES</span><h1>My orders</h1>{error && <p className="error">{error}</p>}{!orders.length && !error ? <p>No orders yet.</p> : <div className="orders-list">{orders.map(order => <article className="order-card" key={order._id}><div className="order-head"><b>Order #{order._id.slice(-7).toUpperCase()}</b><span className="status">{order.orderStatus}</span></div><p className="muted">{new Date(order.createdAt).toLocaleString()}</p>{order.items.map((item, i) => <p key={i}>{item.name} × {item.quantity} — ₹{(item.price * item.quantity).toFixed(2)}</p>)}<hr/><b>Total: ₹{order.totalAmount.toFixed(2)}</b><p className="muted">Payment: Cash on Delivery · {order.paymentStatus}</p><small>{order.deliveryAddress}</small></article>)}</div>}</main>;
}
