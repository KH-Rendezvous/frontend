import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// ▼ 경로가 맞는지 꼭 확인하세요! (보통 components 폴더 안에 있음)
import QnaModal from "../myPage/modals/QnAModal";

const DiscoverySidebar = ({
  myRelIntent = {}, // 내가 선택한 관계
  topRelIntents = [], // 회원들이 많이 선택한 관계
  myInterests = [], // 내가 선택한 관심사
  topInterests = [], // 회원들이 많이 선택한 관심사
}) => {
  const [qnaStatus, setQnaStatus] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 메뉴 설정
  const supportMenus = [
    { label: "AI 매니저", path: "/ai-manager" },
    { label: "우리 어디서 만날까?", path: "/places" },
    { label: "QnA", path: null }, // QnA는 모달로 띄움
    { label: "마이페이지", path: "/myPage" },
    { label: "로그아웃", action: "logout" },
  ];

  // 메뉴 클릭 핸들러
  const handleMenuClick = (item) => {
    if (item.action === "logout") {
      alert("로그아웃 되었습니다.");
      navigate("/signIn");
    } else if (item.label === "QnA") {
      console.log("QnA 모달 열기 시도"); // 디버깅용
      setQnaStatus(true);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      {/* 1. QnA 모달 (isOpen={true} 필수 전달) */}
      {qnaStatus && (
        <QnaModal isOpen={true} onClose={() => setQnaStatus(false)} />
      )}

      {/* 2. 사이드바 영역 */}
      <aside className="w-[360px] h-screen bg-white border-r flex flex-col p-6 overflow-y-auto custom-scrollbar relative z-10">
        {/* 로고 및 상단 탭 */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="mb-12 px-1 cursor-pointer"
            onClick={() => {
              if (location.pathname === "/discovery") {
                window.scrollTo({ top: 0});
              } else {
                navigate("/discovery");
              }
            }}
          >
            <img
              src="/logo.png"
              alt="Rendezvous Logo"
              className="h-[130px] w-auto object-contain hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="flex gap-2 w-full">
            <button
              onClick={() => navigate("/discovery")}
              className="flex-1 py-2 bg-[#FF4458] text-white rounded-full font-bold text-xs shadow-md hover:bg-[#e03e4e] transition-colors"
            >
              탐색
            </button>
            <button className="flex-1 py-2 text-gray-400 font-bold border rounded-full text-xs bg-white hover:bg-gray-50 transition-colors">
              매칭
            </button>
            <button className="flex-1 py-2 text-gray-400 font-bold border rounded-full text-xs bg-white relative hover:bg-gray-50 transition-colors">
              채팅
              <span className="absolute -top-1 -right-1 bg-[#FF4458] text-[9px] text-white w-4 h-4 flex items-center justify-center rounded-full">
                17
              </span>
            </button>
          </div>
        </div>

        {/* 1. 내가 선택한 관계 */}
        <div className="mb-10">
          <div className="p-8 border-2 border-[#FF4458] rounded-[40px] flex flex-col items-center bg-pink-50/20 shadow-sm transition-all hover:shadow-md cursor-pointer">
            {myRelIntent.CODE_NAME ? (
              <>
                <span className="text-5xl mb-3">{myRelIntent.EMOJI}</span>
                <p className="font-black text-gray-800 text-lg">
                  {myRelIntent.CODE_NAME}
                </p>
                <span className="text-[10px] text-pink-500 font-bold mt-1 uppercase">
                  내가 선택한 관계
                </span>
              </>
            ) : (
              <div
                className="flex flex-col items-center opacity-50 text-center hover:opacity-100 transition-opacity"
                onClick={() => navigate("/myPage")} // 클릭 시 마이페이지로 이동 유도
              >
                <span className="text-4xl mb-2">❓</span>
                <p className="text-[10px] font-bold text-gray-600">
                  프로필 수정에서
                  <br />
                  관계를 설정해주세요
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. 인기 있는 관계 */}
        <div className="mb-10 px-1">
          <h3 className="text-gray-800 text-[11px] font-black mb-1">
            인기 있는 관계
          </h3>
          <p className="text-gray-400 text-[9px] mb-4 leading-tight">
            많은 유저들이 지금 이런 인연을 찾고 있어요.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {topRelIntents.length > 0
              ? topRelIntents.slice(0, 2).map((item) => (
                <div
                  key={item.CODE_ID}
                  className="p-4 border border-gray-100 rounded-2xl flex flex-col items-center bg-white shadow-sm hover:border-[#FF4458] hover:shadow-md transition-all cursor-pointer"
                >
                  <span className="text-2xl mb-1">{item.EMOJI}</span>
                  <span className="text-[9px] font-black text-gray-700 text-center">
                    {item.CODE_NAME}
                  </span>
                </div>
              ))
              : // 로딩 스켈레톤 UI
              Array(2)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-50 rounded-2xl animate-pulse"
                  />
                ))}
          </div>
        </div>

        {/* 3. 공통 관심사 */}
        <div className="mb-10 px-1 flex-1">
          <h3 className="text-gray-800 text-[11px] font-black mb-1">
            공통 관심사나 취미
          </h3>
          <p className="text-gray-400 text-[9px] mb-4 leading-tight">
            취향이 통하면 대화도 더 쉽게 통하니까요.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* 내 관심사 */}
            {myInterests.slice(0, 5).map((item) => (
              <div
                key={`my-${item.CODE_ID}`}
                className="p-4 border-2 border-pink-100 rounded-2xl flex flex-col items-center bg-pink-50/20 shadow-sm hover:scale-105 transition-transform cursor-default"
              >
                <span className="text-2xl mb-1">{item.EMOJI}</span>
                <span className="text-[9px] font-black text-gray-800">
                  {item.CODE_NAME}
                </span>
              </div>
            ))}
            {/* 인기 관심사 */}
            {topInterests.slice(0, 5).map((item) => (
              <div
                key={`top-${item.CODE_ID}`}
                className="p-4 border border-gray-100 rounded-2xl flex flex-col items-center bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="text-2xl mb-1">{item.EMOJI}</span>
                <span className="text-[9px] font-black text-gray-600">
                  {item.CODE_NAME}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 서포터 영역 (하단 메뉴) */}
        <div className="mt-auto pt-6 border-t border-gray-50 space-y-2">
          <p className="text-[10px] font-bold text-gray-300 mb-2 px-1 uppercase tracking-tighter italic">
            Support for you
          </p>
          {supportMenus.map((item, index) => {
            const isActive =
              item.path &&
              (location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path)));
            return (
              <button
                key={index}
                onClick={() => handleMenuClick(item)}
                className={`w-full py-2.5 text-[11px] font-bold rounded-xl transition-all active:scale-95 border hover:cursor-pointer
                  ${isActive
                    ? "bg-pink-50 text-[#FF4458] border-[#FF4458]"
                    : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-[#FF4458] hover:border-[#FF4458]/30"
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default DiscoverySidebar;
