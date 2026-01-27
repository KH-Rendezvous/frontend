import React from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import AdminUserManagement from "./AdminUserManagement";
import AdminQna from "./AdminQna";
import AdminReport from "./AdminReport";
import AdminSupport from "./AdminSupport";
import SideBar from "./SideBar";
import AdminReportDetail from "./AdminReportDetail";

const AdminComponent = () => {
  const baseStyle =
    "w-[356px] h-[70px] flex items-center justify-center text-[20px] font-bold rounded-2xl shadow";
  const getNavLinkStyle = ({ isActive }) => {
    return isActive
      ? `${baseStyle} bg-[#EE4B6F] text-white text-2xl"
            to="/admin/userManagement`
      : `${baseStyle} bg-white text-black hover:`;
  };
  return (
    <div className="flex">
      <SideBar getNavLinkStyle={getNavLinkStyle} />
      <section className="w-full">
        <Routes>
          <Route path="/" element={<Navigate to="userManagement" replace />} />
          <Route path="userManagement" element={<AdminUserManagement />} />
          <Route path="qna" element={<AdminQna />} />
          <Route path="report" element={<AdminReport />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="report/:id" element={<AdminReportDetail />} />
        </Routes>
      </section>
    </div>
  );
};

export default AdminComponent;
