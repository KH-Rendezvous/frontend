// src/components/auth/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // 로그인 여부 확인 (토큰 유무)
  const isLogin = !!(
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
  );

  // 로그인 했으면 자식 컴포넌트(Outlet) 보여주고, 아니면 로그인 페이지로 리다이렉트
  return isLogin ? <Outlet /> : <Navigate to="/signIn" replace />;
};

export default PrivateRoute;
