
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, ShoppingCart, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-icon">
          <BookOpen size={22} />
        </span>
        QuickMart
      </Link>

      <nav>
        <NavLink to="/">Home</NavLink>
        {user && <NavLink to="/orders">My Orders</NavLink>}
        {user?.role === "admin" && (
          <NavLink to="/admin">Admin</NavLink>
        )}
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="welcome">
              <UserRound size={16} /> {user.name.split(" ")[0]}
            </span>

            <button
              className="icon-btn"
              onClick={() => navigate("/cart")}
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              <b>{count}</b>
            </button>

            <button className="text-btn" onClick={signOut}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link className="text-btn" to="/login">
              Login
            </Link>
            <Link className="small-primary" to="/register">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
