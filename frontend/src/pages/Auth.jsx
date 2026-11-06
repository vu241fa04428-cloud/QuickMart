import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      if (isRegister) await register(form);
      else await login(form.email, form.password);
      navigate("/");
    } catch (err) { setError(err.response?.data?.message || "Something went wrong. Check the backend connection."); }
    finally { setBusy(false); }
  }
  return <main className="auth-wrap"><form className="auth-card" onSubmit={submit}>
    <span className="eyebrow">{isRegister ? "JOIN QUICKMART" : "WELCOME BACK"}</span><h1>{isRegister ? "Create your account" : "Log in to QuickMart"}</h1><p className="muted">{isRegister ? "Your study essentials are just a few clicks away." : "Continue shopping for your favourites."}</p>
    {error && <div className="error">{error}</div>}
    {isRegister && <><label>Full name<input name="name" value={form.name} onChange={change} required/></label><label>Phone (optional)<input name="phone" value={form.phone} onChange={change}/></label></>}
    <label>Email address<input type="email" name="email" value={form.email} onChange={change} required/></label>
    <label>Password<input type="password" name="password" value={form.password} onChange={change} minLength="6" required/></label>
    <button className="primary-btn full" disabled={busy}>{busy ? "Please wait..." : isRegister ? "Create account" : "Login"}</button>
    <p className="switch-auth">{isRegister ? "Already have an account?" : "New to QuickMart?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Login" : "Create account"}</Link></p>
  </form></main>;
}
