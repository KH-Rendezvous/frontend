import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HeaderComponent = () => {
  // 스크롤 시 그림자 효과를 주기 위한 상태 관리
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // 상단 고정 헤더 (스크롤 시 배경 블러 및 그림자 효과)
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="w-full max-w-[1280px] mx-auto px-6  md:px-10 h-[100px] flex items-center justify-between">
        {/* 1. 로고 영역 */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="Rendezvous Logo"
            className="h-[100px] w-auto object-contain hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* 2. 우측 버튼 그룹 */}
        <div className="flex items-center gap-4">
          {/* Sign In : 2차 액션 (텍스트 버튼 스타일) */}
          <Link
            to="/signIn"
            className="text-gray-600 font-bold px-4 py-2 rounded-lg hover:text-[#EE4B6F] hover:bg-[#fff0f3] transition-all duration-300"
          >
            Sign in
          </Link>

          {/* Sign Up : 1차 액션 (강조된 버튼 스타일) */}
          <Link
            to="/signUp"
            className="bg-[#EE4B6F] text-white px-6 py-2.5 rounded-full font-bold shadow-md 
            hover:bg-[#d63a5c] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
