import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { add } = useCart();
  async function addToCart() {
    if (!user) return alert("Please log in to add products to your cart.");
    try { await add(product._id); alert("Added to cart!"); }
    catch (e) { alert(e.response?.data?.message || "Could not add item."); }
  }
  return <article className="product-card">
    <Link to={`/product/${product._id}`} className="product-image">
      <img src={product.image || "https://placehold.co/600x400?text=QuickMart"} alt={product.name}/>
      <span className="category-tag">{product.category}</span>
    </Link>
    <div className="product-info">
      <p className="muted">{product.brand || "QuickMart"}</p>
      <Link to={`/product/${product._id}`}><h3>{product.name}</h3></Link>
      <div className="product-bottom"><strong>₹{product.price.toFixed(2)}</strong><button className="add-btn" onClick={addToCart} disabled={product.stock < 1}><ShoppingCart size={16}/> Add</button></div>
      <small className={product.stock > 0 ? "stock" : "out-stock"}>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</small>
    </div>
  </article>;
}
