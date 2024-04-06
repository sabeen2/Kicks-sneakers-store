import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import LoginForm from "../components/Login";
import ResetPassword from "../components/ResetPassword";

const MyRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginForm />} />
      <Route path="forgot-password" element={<ResetPassword />} />
      <Route path="dashboard/*" element={<Dashboard />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
};

export default MyRoutes;
