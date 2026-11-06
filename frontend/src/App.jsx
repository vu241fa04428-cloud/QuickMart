import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import { useAuth } from "./context/AuthContext";

function Protected({ children, admin = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return <><Navbar/><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Auth mode="login"/>}/>
    <Route path="/register" element={<Auth mode="register"/>}/>
    <Route path="/product/:id" element={<ProductDetails/>}/>
    <Route path="/cart" element={<Protected><Cart/></Protected>}/>
    <Route path="/checkout" element={<Protected><Checkout/></Protected>}/>
    <Route path="/orders" element={<Protected><Orders/></Protected>}/>
    <Route path="/admin" element={<Protected admin><Admin/></Protected>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes><footer className="footer">© {new Date().getFullYear()} QuickMart · Books, stationery and better study days.</footer></>;
}
