import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role"); // 'user' or 'admin'

  if (!token) return <Navigate to="/" replace />; // Not logged in
  if (adminOnly && role !== "admin") return <Navigate to="/home" replace />; // Block non-admins

  return children;
}
