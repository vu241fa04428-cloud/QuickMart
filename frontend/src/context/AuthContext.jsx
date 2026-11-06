import { createContext, useContext, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("quickmart_user")); } catch { return null; }
  });

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("quickmart_token", data.token);
    localStorage.setItem("quickmart_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function register(form) {
    const { data } = await api.post("/auth/register", form);
    localStorage.setItem("quickmart_token", data.token);
    localStorage.setItem("quickmart_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("quickmart_token");
    localStorage.removeItem("quickmart_user");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
