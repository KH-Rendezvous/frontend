import React from "react";
import { NavLink } from "react-router-dom";

// [수정] closeSidebar props 추가
const SideBar = ({ getNavLinkStyle, closeSidebar }) => {
  return (
    <aside className="bg-white h-full w-full flex flex-col items-center overflow-y-auto pb-10 h-[10000px]">
      {/* 로고 영역 */}
      <div className="w-full h-[150px] lg:h-[200px] flex items-center justify-center border-b border-gray-50 mb-8 lg:mb-10 flex-shrink-0">
        <img
          src="/logo.png"
          alt="Rendezvous Logo"
          className="w-[120px] lg:w-[160px] object-contain cursor-pointer hover:opacity-80 transition-opacity"
        />
      </div>

      {/* 메뉴 리스트 */}
      <nav className="flex flex-col gap-4 lg:gap-8 w-full items-center px-4 lg:px-6 flex-1">
        <div className="flex flex-col gap-4 lg:gap-6 w-full items-center">
          {/* [핵심 수정] 
             onClick={closeSidebar} 를 추가하여 
             메뉴 클릭 시 부모(AdminComponent)의 상태를 변경해 사이드바를 닫음 
          */}

          <NavLink
            to="/admin/userManagement"
            className={getNavLinkStyle}
            onClick={closeSidebar}
          >
            회원 관리
          </NavLink>

          <NavLink
            to="/admin/qna"
            className={getNavLinkStyle}
            onClick={closeSidebar}
          >
            QnA
          </NavLink>

          <NavLink
            to="/admin/report"
            className={getNavLinkStyle}
            onClick={closeSidebar}
          >
            신고 내역
          </NavLink>

          <NavLink
            to="/admin/support"
            className={getNavLinkStyle}
            onClick={closeSidebar}
          >
            고객 지원
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
