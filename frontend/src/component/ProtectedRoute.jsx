import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { authUser } = useSelector((state) => state.user);

  // 🔐 Check if user is logged in
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allow access
  return <Outlet />;
};

export default ProtectedRoute;
