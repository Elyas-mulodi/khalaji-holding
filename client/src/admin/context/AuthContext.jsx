import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    const savedAdmin = localStorage.getItem("adminData");

    if (savedAdmin && savedToken) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }

    setLoading(false);
  }, []);

  const login = (tokenData, adminData) => {
    localStorage.setItem("adminToken", tokenData);
    localStorage.setItem("adminData", JSON.stringify(adminData));
    setToken(tokenData);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
