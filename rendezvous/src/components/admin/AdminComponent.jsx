import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminUserManagement from "./AdminUserManagement";
import AdminQna from "./AdminQna";
import AdminReport from "./AdminReport";
import AdminSupport from "./AdminSupport";
import SideBar from "./SideBar";
import AdminReportDetail from "./AdminReportDetail";
import { Menu, X } from "lucide-react";

const AdminComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // [버튼 스타일] w-full로 설정하여 SideBar 컨테이너 크기에 맞춰짐
  const baseStyle =
    "w-full h-[55px] lg:h-[64px] flex items-center justify-center text-lg lg:text-xl font-bold rounded-2xl shadow-sm transition-all duration-200";

  const getNavLinkStyle = ({ isActive }) => {
    return isActive
      ? `${baseStyle} bg-[#EE4B6F] text-white shadow-md transform scale-[1.02]`
      : `${baseStyle} bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100`;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8F9FA]">
      {/* [모바일 헤더] */}
      <header className="lg:hidden flex items-center justify-between px-5 py-3 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm h-16">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
        <button
          onClick={toggleSidebar}
          className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* [모바일 사이드바 배경 오버레이] */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
      />

      {/* [사이드바 컨테이너] */}
      {/* 여기서 너비를 조절합니다. 모바일 280px / 데스크탑 320px */}
      <div
        // ▼ 수정됨: h-full -> h-screen (화면 전체 높이로 강제 설정)
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-white border-r border-gray-200 shadow-xl lg:shadow-none transition-transform duration-300 transform lg:translate-x-0 
        w-[280px] lg:w-[320px] shrink-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SideBar
          getNavLinkStyle={getNavLinkStyle}
          closeSidebar={closeSidebar}
        />
      </div>

      {/* [메인 컨텐츠] */}
      <section className="flex-1 w-full p-4 md:p-8 lg:p-10 overflow-x-hidden flex flex-col">
        <div className="w-full max-w-[1400px] mx-auto">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="userManagement" replace />}
            />
            <Route path="userManagement" element={<AdminUserManagement />} />
            <Route path="qna" element={<AdminQna />} />
            <Route path="report" element={<AdminReport />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="report/:id" element={<AdminReportDetail />} />
          </Routes>
        </div>
      </section>
    </div>
  );
};

export default AdminComponent;
