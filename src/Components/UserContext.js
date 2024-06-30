// AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setFirstName(localStorage.getItem("firstName") || "");
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const login = (token, firstName) => {
    localStorage.setItem("token", token);
    localStorage.setItem("firstName", firstName);
    setIsLoggedIn(true);
    setFirstName(firstName);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    setIsLoggedIn(false);
    setFirstName("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, firstName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
