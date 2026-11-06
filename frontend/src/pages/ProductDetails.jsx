import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { add } = useCart();
  useEffect(() => { api.get(`/products/${id}`).then(r => setProduct(r.data)).catch(() => setError("Product not found.")); }, [id]);
  if (error) return <main className="page"><p>{error}</p><Link to="/">Back to shop</Link></main>;
  if (!product) return <main className="page">Loading product...</main>;
  async function addItem() {
    if (!user) return setError("Please log in before adding items to your cart.");
    try { await add(product._id, qty); setError("Added to your cart."); }
    catch (e) { setError(e.response?.data?.message || "Could not add item."); }
  }
  return <main className="page detail-layout"><img className="detail-image" src={product.image || "https://placehold.co/700x500?text=QuickMart"} alt={product.name}/><div><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><p className="muted">{product.brand}</p><h2>₹{product.price.toFixed(2)}</h2><p>{product.description}</p><p>{product.stock} available</p><div className="quantity"><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><b>{qty}</b><button onClick={() => setQty(Math.min(product.stock || 1, qty + 1))}>+</button></div><button className="primary-btn" disabled={!product.stock} onClick={addItem}>Add to cart</button>{error && <p className="notice">{error}</p>}<p><Link to="/">← Continue shopping</Link></p></div></main>;
}
