import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const HeaderComponent = () => {
  // 스크롤 시 그림자 효과를 주기 위한 상태 관리
  const [isScrolled, setIsScrolled] = useState(false);

  const [loginMember, setLoginMember] = useState(null);

  const navigate = useNavigate();

  // 로그인한 회원 정보 상태
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // 로컬스토리지 확인 함수
    const checkLoginStatus = () => {
      const storedMember = localStorage.getItem("loginMember");
      if (storedMember) {
        setLoginMember(JSON.parse(storedMember));
      } else {
        setLoginMember(null);
      }
    };

    // 초기 실행
    handleScroll();
    checkLoginStatus();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("loginStateChange", checkLoginStatus);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("loginStateChange", checkLoginStatus);
    };
  }, []);

  // 로그아웃 핸들러도 수정 (로그아웃 시에도 신호 쏘기)
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("loginMember");
      localStorage.removeItem("accessToken");
      setLoginMember(null);

      window.dispatchEvent(new Event("loginStateChange"));

      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

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
          {loginMember ? (
            <>
              {/* 환영 문구 */}
              <span className="text-gray-700 font-bold px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm md:text-base">
                👋 {loginMember.nickname}님 환영합니다
              </span>

              {/* 관리자 버튼 (권한 체크: 니 DB 설정에 따라 조건문 수정해라. 보통 2가 관리자임) */}
              {loginMember.authority === 2 && (
                <Link
                  to="/admin"
                  className="bg-gray-800 text-white px-5 py-2.5 rounded-full font-bold shadow-md 
                  hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base"
                >
                  Admin
                </Link>
              )}

              {/* My Page 버튼 */}
              <Link
                to="/myPage"
                className="bg-[#EE4B6F] text-white px-5 py-2.5 rounded-full font-bold shadow-md 
                hover:bg-[#d63a5c] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base"
              >
                My page
              </Link>

              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full text-gray-500 font-bold text-sm 
                          hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 transition-all duration-200 ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            /* 로그인 안 함 -> 기존 Sign In / Sign Up 버튼 */
            <>
              <Link
                to="/signIn"
                className="text-gray-600 font-bold px-4 py-2 rounded-lg hover:text-[#EE4B6F] hover:bg-[#fff0f3] transition-all duration-300"
              >
                Sign in
              </Link>

              <Link
                to="/signUp"
                className="bg-[#EE4B6F] text-white px-6 py-2.5 rounded-full font-bold shadow-md 
                hover:bg-[#d63a5c] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
