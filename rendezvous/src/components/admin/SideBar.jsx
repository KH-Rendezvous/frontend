import React from "react";
import { NavLink } from "react-router-dom";

const SideBar = ({ getNavLinkStyle }) => {
  return (
    <aside className="bg-white min-h-screen w-[420px] min-w-[420px] flex flex-col items-center border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.03)] sticky top-0 z-50">
      <div className="w-full h-[200px] flex items-center justify-center border-b border-gray-50 mb-10">
        <img
          src="/logo.png"
          alt="Rendezvous Logo"
          className="w-[160px] object-contain "
        />
      </div>

      <nav className="flex flex-col gap-8 w-full items-center px-6 flex-1">
        <div className="flex flex-col gap-6 w-full items-center">
          <NavLink to="/admin/userManagement" className={getNavLinkStyle}>
            회원 관리
          </NavLink>

          <NavLink to="/admin/qna" className={getNavLinkStyle}>
            QnA
          </NavLink>

          <NavLink to="/admin/report" className={getNavLinkStyle}>
            신고 내역
          </NavLink>

          <NavLink to="/admin/support" className={getNavLinkStyle}>
            고객 지원
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
