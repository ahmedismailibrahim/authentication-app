import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();
  if (!accessToken) {
    navigate("/auth/login", { replace: true });
    return null; // or a loading spinner, or a message indicating redirection
  } else {
    return children;
  }
};

export default RequireAuth;
