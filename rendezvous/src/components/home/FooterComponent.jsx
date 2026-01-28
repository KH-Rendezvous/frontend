import React from "react";
import { Link } from "react-router-dom";

const FooterComponent = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* 상단: 정보 및 링크 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* 1. 브랜드 정보 */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Rendezvous Logo"
                className="h-[30px] w-auto opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              랑데뷰는 진정한 만남을 추구하는 소셜 데이팅 플랫폼입니다.
              <br />
              당신의 취향과 가치관이 통하는 운명의 상대를 찾아보세요.
            </p>
          </div>

          {/* 2. 바로가기 메뉴 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-gray-800 text-sm">Rendezvous</h3>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li>
                <Link
                  to="/service-intro"
                  className="hover:text-[#EE4B6F] transition-colors"
                >
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link
                  to="/user-guide"
                  className="hover:text-[#EE4B6F] transition-colors"
                >
                  이용 가이드
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. 고객지원 및 정책 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-gray-800 text-sm">
              Support & Policy
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li>
                <Link
                  to="/terms"
                  className="hover:text-[#EE4B6F] transition-colors"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="font-bold text-gray-700 hover:text-[#EE4B6F] transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단: 카피라이트 및 소셜 아이콘 */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            © 2026 Rendezvous Inc. All rights reserved.
          </p>

          {/* 소셜 아이콘 (SVG) */}
          <div className="flex gap-4">
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-[#EE4B6F] hover:text-white transition-all duration-300"
            >
              {/* Instagram Icon */}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 4a6 6 0 100 12 6 6 0 000-12zm0 3a3 3 0 110 6 3 3 0 010-6z"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-[#EE4B6F] hover:text-white transition-all duration-300"
            >
              {/* Facebook Icon */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-[#EE4B6F] hover:text-white transition-all duration-300"
            >
              {/* Youtube Icon */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
