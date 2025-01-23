import React from "react";
import { useNavigate } from "react-router-dom";
// import { useUser } from "./criticalState";

interface ProtectedRouteProps {
  children: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  const navigate = useNavigate();
  const user = storedUser ? JSON.parse(storedUser) : null;
  if (!user) {
    navigate("/");
  }

  return <>{children}</>;
};

export default ProtectedRoute;
