import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Components/UserContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/scmtracker" state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
