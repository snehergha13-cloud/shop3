// =============================================
// context/AuthContext.js
// Global auth state — stores the JWT in localStorage,
// exposes the current user, and login/signup/logout helpers.
// =============================================

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext();
const TOKEN_KEY = "woa_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (authToken) => {
    if (!authToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth-me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
      } else {
        // Token expired/invalid — clear it.
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount, restore the session from localStorage.
  // (One-time initialization effect — the set-state-in-effect lint rule
  // is overly strict for this standard "hydrate from storage" pattern.)
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(stored);
      loadUser(stored);
    } else {
      setLoading(false);
    }
  }, [loadUser]);

  function persistSession(newToken, newUser) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }

  async function login(email, password) {
    const res = await fetch("/api/auth-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Login failed");
    persistSession(data.data.token, data.data.user);
    return data.data.user;
  }

  async function signup(name, email, password) {
    const res = await fetch("/api/auth-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Sign up failed");
    persistSession(data.data.token, data.data.user);
    return data.data.user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  // Convenience helper so other contexts (e.g. CartContext) can make
  // authenticated requests without re-deriving headers everywhere.
  function authHeaders() {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === "admin",
        isLoggedIn: !!user,
        login,
        signup,
        logout,
        authHeaders,
        refreshUser: () => loadUser(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
