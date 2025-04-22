import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicOnlyRoute = () => {
  const { authUser } = useSelector((state) => state.user);

  // 🔒 If already logged in, redirect to dashboard
  if (authUser) {
    return <Navigate to="/" replace />;
  }

  // ✅ Otherwise, allow access to login/signup
  return <Outlet />;
};

export default PublicOnlyRoute;
