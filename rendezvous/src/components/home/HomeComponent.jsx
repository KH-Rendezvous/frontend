import React from "react";
import HeaderComponent from "./HeaderComponent";
import { Link } from "react-router-dom";
import FooterComponent from "./FooterComponent";

const HomeComponent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderComponent />

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* 1. 히어로 섹션 (메인 배너) */}
        <section className="flex flex-col-reverse lg:flex-row justify-between items-center py-16 lg:py-24 gap-10 lg:gap-20">
          {/* 텍스트 영역 */}
          <div className="flex flex-col gap-8 text-center lg:text-left items-center lg:items-start flex-1 animate-fadeInUp">
            <div className="space-y-2">
              <p className="text-3xl md:text-[50px] font-bold leading-tight text-gray-800">
                우리의 만남이 <br className="hidden md:block" />
                시작되는 곳,
              </p>
              <p className="text-4xl md:text-[60px] font-extrabold text-[#EE4B6F]">
                랑데뷰
              </p>
            </div>

            <p className="text-gray-500 text-lg md:text-xl">
              당신의 취향과 가치관이 통하는
              <br className="md:hidden" /> 운명의 상대를 찾아보세요.
            </p>

            <Link
              to="/signIn"
              className="bg-[#EE4B6F] text-white w-full max-w-[280px] py-4 rounded-full font-bold text-xl 
              hover:bg-[#d63a5c] transition-all duration-300 shadow-lg hover:shadow-[#EE4B6F]/40 transform hover:-translate-y-1 text-center"
            >
              지금 시작하기
            </Link>
          </div>

          {/* 이미지 영역 */}
          <div className="flex-1 w-full max-w-[500px] lg:max-w-none relative animate-float">
            {/* 이미지 배경 장식 (원형) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[#EE4B6F]/5 rounded-full blur-3xl -z-10"></div>
            <img
              src="/people.png"
              alt="랑데뷰 메인 이미지"
              className="w-full h-auto object-cover rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </section>

        {/* 2. 기능 소개 섹션 (Cards) */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">
              Why Rendezvous?
            </h2>
            <p className="text-gray-500 mt-3">
              랑데뷰만의 특별한 기능을 경험해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#fff0f3] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#EE4B6F] transition-colors duration-300">
                {/* 하트 아이콘 SVG */}
                <svg
                  className="w-8 h-8 text-[#EE4B6F] group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                퍼펙트 매칭
              </h3>
              <p className="text-gray-500 leading-relaxed">
                성향과 관심사를 정밀 분석해
                <br />
                당신과 가장 잘 맞는
                <br />
                <span className="font-semibold text-[#EE4B6F]">소울메이트</span>
                를 연결해 드려요.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#fff0f3] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#EE4B6F] transition-colors duration-300">
                {/* 봇/메시지 아이콘 SVG */}
                <svg
                  className="w-8 h-8 text-[#EE4B6F] group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                AI 코칭 매니저
              </h3>
              <p className="text-gray-500 leading-relaxed">
                첫 마디가 어렵나요?
                <br />
                대화 주제 추천부터 연애 조언까지
                <br />
                <span className="font-semibold text-[#EE4B6F]">AI</span>가
                도와드릴게요.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#fff0f3] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#EE4B6F] transition-colors duration-300">
                {/* 지도 핀 아이콘 SVG */}
                <svg
                  className="w-8 h-8 text-[#EE4B6F] group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                핫플레이스 추천
              </h3>
              <p className="text-gray-500 leading-relaxed">
                우리 어디서 만날까?
                <br />
                만남을 더 특별하게 만들어 줄<br />
                <span className="font-semibold text-[#EE4B6F]">
                  최적의 장소
                </span>
                를 추천해요.
              </p>
            </div>
          </div>
        </section>

        {/* 3. 하단 CTA (Call To Action) 섹션 */}
        <section className="py-20">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-[40px] px-6 py-16 flex flex-col items-center justify-center gap-8 shadow-inner relative overflow-hidden">
            {/* 배경 장식용 원 */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#EE4B6F]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#EE4B6F]/5 rounded-full blur-3xl"></div>

            <div className="z-10 text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                운명 같은 만남, 지금 시작해볼까요?
              </h2>
              <p className="text-gray-500 text-lg">
                당신의 소중한 인연이 랑데뷰에서 기다리고 있습니다.
              </p>
            </div>

            <Link
              to="/signIn"
              className="z-10 bg-[#EE4B6F] text-white px-10 py-4 rounded-full text-xl font-bold 
              hover:bg-[#d63a5c] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              내 인연 찾으러 가기
            </Link>
          </div>
        </section>
        <Link
          to="/qna?mode=guest"
          className="fixed bottom-8 right-8 z-50 group flex items-center gap-3"
        >
          {/* 호버 시 나타나는 말풍선 */}
          <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-pink-50 text-[#EE4B6F] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            로그인이 안 되시나요?
          </div>
          <div className="w-16 h-16 bg-[#EE4B6F] text-white rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(238,75,111,0.4)] hover:scale-110 active:scale-95 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </div>
        </Link>
      </main>
      <FooterComponent />
    </div>
  );
};

export default HomeComponent;
