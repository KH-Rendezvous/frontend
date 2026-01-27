import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QnaModal from "../myPage/modals/QnAModal";

const DiscoverySidebar = ({
  myRelIntent = {}, // 내가 선택한 관계
  topRelIntents = [], // 회원들이 많이 선택한 관계
  myInterests = [], // 내가 선택한 관심사
  topInterests = [], // 회원들이 많이 선택한 관심사
}) => {
  const [qnaStatus, setQnaStatus] = useState(false);
  const navigate = useNavigate();
  const supportMenus = [
    { label: "AI 매니저", path: "/ai-manager" },
    { label: "우리 어디서 만날까?", path: "/places" },
    { label: "QnA", path: null },
    { label: "마이페이지", path: "/myPage" },
    { label: "로그아웃", action: "logout" },
  ];

  const handleMenuClick = (item) => {
    if (item.action === "logout") {
      alert("로그아웃 되었습니다.");
      navigate("/signIn");
    } else if (item.label === "QnA") {
      setQnaStatus(true);
    } else if (item.path) {
      navigate(item.path);
    }
  };
  return (
    <>
      {qnaStatus && (
        <QnaModal isOpen={true} onClose={() => setQnaStatus(false)} />
      )}
      <aside className="w-[360px] h-screen bg-white border-r flex flex-col p-6 overflow-y-auto custom-scrollbar">
        {/* 로고 및 상단 탭 */}
        <div className="flex flex-col items-center mb-8">
          {/* 로고 영역: 높이를 80px(h-20급)로 키우고 마진을 조정했습니다. */}
          <div
            className="mb-12 px-1 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <img
              src="/logo.png"
              alt="Rendezvous Logo"
              className="h-[130px] w-auto object-contain hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="flex gap-2 w-full">
            <button className="flex-1 py-2 bg-[#FF4458] text-white rounded-full font-bold text-xs shadow-md">
              탐색
            </button>
            <button className="flex-1 py-2 text-gray-400 font-bold border rounded-full text-xs bg-white">
              매칭
            </button>
            <button className="flex-1 py-2 text-gray-400 font-bold border rounded-full text-xs bg-white relative">
              채팅{" "}
              <span className="absolute -top-1 -right-1 bg-[#FF4458] text-[9px] text-white w-4 h-4 flex items-center justify-center rounded-full">
                17
              </span>
            </button>
          </div>
        </div>

        {/* 1. 내가 선택한 관계 (회원가입 정보 연동) */}
        <div className="mb-10">
          <div className="p-8 border-2 border-[#FF4458] rounded-[40px] flex flex-col items-center bg-pink-50/20 shadow-sm transition-all">
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
              <div className="flex flex-col items-center opacity-30 text-center">
                <span className="text-4xl mb-2">❓</span>
                <p className="text-[10px] font-bold">
                  프로필 수정에서
                  <br />
                  관계를 설정해주세요
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. 인기 있는 관계 (전체 유저 통계 Top 2) */}
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
                    className="p-4 border border-gray-100 rounded-2xl flex flex-col items-center bg-white shadow-sm"
                  >
                    <span className="text-2xl mb-1">{item.EMOJI}</span>
                    <span className="text-[9px] font-black text-gray-700 text-center">
                      {item.CODE_NAME}
                    </span>
                  </div>
                ))
              : Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-24 bg-gray-50 rounded-2xl animate-pulse"
                    />
                  ))}
          </div>
        </div>

        {/* 3. 공통 관심사 (내 설정 5개 + 인기 5개) */}
        <div className="mb-10 px-1 flex-1">
          <h3 className="text-gray-800 text-[11px] font-black mb-1">
            공통 관심사나 취미
          </h3>
          <p className="text-gray-400 text-[9px] mb-4 leading-tight">
            취향이 통하면 대화도 더 쉽게 통하니까요.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* 내 관심사 (최대 5개) */}
            {myInterests.slice(0, 5).map((item) => (
              <div
                key={`my-${item.CODE_ID}`}
                className="p-4 border-2 border-pink-100 rounded-2xl flex flex-col items-center bg-pink-50/20 shadow-sm"
              >
                <span className="text-2xl mb-1">{item.EMOJI}</span>
                <span className="text-[9px] font-black text-gray-800">
                  {item.CODE_NAME}
                </span>
              </div>
            ))}
            {/* 인기 관심사 (최대 5개) */}
            {topInterests.slice(0, 5).map((item) => (
              <div
                key={`top-${item.CODE_ID}`}
                className="p-4 border border-gray-100 rounded-2xl flex flex-col items-center bg-white"
              >
                <span className="text-2xl mb-1">{item.EMOJI}</span>
                <span className="text-[9px] font-black text-gray-600">
                  {item.CODE_NAME}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 서포터 영역 */}
        <div className="mt-auto pt-6 border-t border-gray-50 space-y-2">
          <p className="text-[10px] font-bold text-gray-300 mb-2 px-1 uppercase tracking-tighter italic">
            Support for you
          </p>
          {supportMenus.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className="w-full py-2.5 text-[11px] font-bold text-gray-500 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:text-[#FF4458] transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default DiscoverySidebar;
