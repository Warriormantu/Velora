import { createContext, useState, useCallback, useContext } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

// ── Create the context ──────────────────────────────────────────
export const AuthContext = createContext(null);

// ── Helper: safely read persisted user from localStorage ────────
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("userInfo");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ── Provider ────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome back, ${data.name}! ✨`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", { name, email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome to Velora, ${data.name}! 🎉`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("userInfo");
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Convenience hook ─────────────────────────────────────────────
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
};
