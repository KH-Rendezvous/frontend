import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  // 1. 로컬스토리지에서 로그인 정보 가져오기
  const storedMember = localStorage.getItem("loginMember");
  const loginMember = storedMember ? JSON.parse(storedMember) : null;

  // 2. 권한 검사
  const isAdmin = loginMember && loginMember.authority === 2;

  if (!isAdmin) {
    alert("접근 권한이 없습니다. 관리자만 접근 가능합니다.");
    // 권한 없으면 메인으로 강제 이동 (리다이렉트)
    return <Navigate to="/" replace />;
  }

  // 3. 통과하면 자식 라우트(Outlet) 보여줌
  return <Outlet />;
};

export default AdminRoute;
