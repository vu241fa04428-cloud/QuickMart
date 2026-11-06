import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, total, update, remove } = useCart();
  const navigate = useNavigate();
  if (!items.length) return <main className="page empty-state"><h1>Your cart is empty</h1><p>Find something useful for your studies.</p><Link className="primary-btn" to="/">Shop now</Link></main>;
  return <main className="page"><span className="eyebrow">YOUR BAG</span><h1>Shopping cart</h1><div className="cart-layout"><div className="cart-list">{items.map(item => <div className="cart-item" key={item.product._id}><img src={item.product.image} alt=""/><div className="cart-desc"><b>{item.product.name}</b><small>₹{item.product.price.toFixed(2)} each</small><button className="link-btn" onClick={() => remove(item.product._id)}>Remove</button></div><div className="quantity"><button onClick={() => update(item.product._id, Math.max(1, item.quantity - 1))}>−</button><b>{item.quantity}</b><button onClick={() => update(item.product._id, item.quantity + 1)}>+</button></div><strong>₹{(item.product.price * item.quantity).toFixed(2)}</strong></div>)}</div><aside className="summary"><h3>Order summary</h3><p><span>Subtotal</span><b>₹{total.toFixed(2)}</b></p><p><span>Delivery</span><b>Calculated at checkout</b></p><hr/><h2>₹{total.toFixed(2)}</h2><button className="primary-btn full" onClick={() => navigate("/checkout")}>Proceed to checkout</button></aside></div></main>;
}
