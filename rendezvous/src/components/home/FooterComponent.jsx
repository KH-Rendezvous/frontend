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
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
