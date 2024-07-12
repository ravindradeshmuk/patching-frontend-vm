// AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem("token");
    const storedFirstName = localStorage.getItem("firstName");
    if (token && storedFirstName) {
      setIsLoggedIn(true);
      setFirstName(storedFirstName);
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
