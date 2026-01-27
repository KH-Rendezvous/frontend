import React from "react";
import { NavLink } from "react-router-dom";

const SideBar = ({ getNavLinkStyle }) => {
  return (
    <div>
      {" "}
      <div className="bg-[#FDFCFB] h-screen  flex flex-col items-center px-10">
        <img src="/logo.png" alt="logo" className="w-[142px]" />
        <section className="flex flex-col items-center gap-10">
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
        </section>
      </div>
    </div>
  );
};

export default SideBar;
