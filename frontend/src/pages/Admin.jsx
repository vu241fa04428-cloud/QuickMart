import { useEffect, useState } from "react";
import api from "../api";

const empty = { name: "", description: "", price: "", category: "Stationery", image: "", stock: "", brand: "" };

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  async function load() {
    const [p, o] = await Promise.all([api.get("/products"), api.get("/orders")]);
    setProducts(p.data); setOrders(o.data);
  }
  useEffect(() => { load().catch(e => setMessage(e.response?.data?.message || "Admin access required.")); }, []);
  async function create(e) {
    e.preventDefault(); setMessage("");
    try { await api.post("/products", { ...form, price: Number(form.price), stock: Number(form.stock) }); setForm(empty); setMessage("Product added."); await load(); }
    catch (e) { setMessage(e.response?.data?.message || "Could not add product."); }
  }
  async function remove(id) {
    if (!confirm("Delete this product?")) return;
    try { await api.delete(`/products/${id}`); await load(); } catch (e) { setMessage(e.response?.data?.message || "Delete failed."); }
  }
  async function updateStatus(id, orderStatus) {
    try { await api.patch(`/orders/${id}/status`, { orderStatus }); await load(); } catch (e) { setMessage(e.response?.data?.message || "Could not update order."); }
  }
  return <main className="page"><span className="eyebrow">QUICKMART MANAGEMENT</span><h1>Admin dashboard</h1>{message && <p className="notice">{message}</p>}<div className="admin-grid"><form className="admin-form" onSubmit={create}><h2>Add a product</h2>{["name","description","price","image","stock","brand"].map(key => <label key={key}>{key[0].toUpperCase()+key.slice(1)}<input required={["name","price","stock"].includes(key)} type={["price","stock"].includes(key) ? "number" : "text"} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}/></label>)}<label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Stationery</option><option>Books</option></select></label><button className="primary-btn">Add product</button></form><section><h2>Products ({products.length})</h2><div className="admin-list">{products.map(p => <div key={p._id}><span>{p.name}<small>₹{p.price} · {p.stock} stock</small></span><button className="link-btn danger" onClick={() => remove(p._id)}>Delete</button></div>)}</div></section></div><section className="admin-orders"><h2>Manage orders ({orders.length})</h2>{orders.map(o => <div className="admin-order" key={o._id}><span><b>#{o._id.slice(-7).toUpperCase()}</b><small>{o.user?.name} · ₹{o.totalAmount}</small></span><select value={o.orderStatus} onChange={e => updateStatus(o._id, e.target.value)}>{["Placed","Confirmed","Shipped","Delivered","Cancelled"].map(s => <option key={s}>{s}</option>)}</select></div>)}</section></main>;
}
