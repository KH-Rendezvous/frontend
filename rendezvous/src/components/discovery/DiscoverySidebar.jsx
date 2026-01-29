import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QnaModal from "../myPage/modals/QnAModal";

const DiscoverySidebar = ({
  myRelIntent = {}, 
  topRelIntents = [], 
  myInterests = [], 
  topInterests = [], 
  onTabChange, 
  activeTab = "received", 
  matchData
}) => {
  const [qnaStatus, setQnaStatus] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isMatchingOrChat = location.pathname === "/matching" || location.pathname === "/chat";

  // 내 관심사 5개는 연한 핑크 배경을 주기 위해 isMine 속성 추가
  const combinedInterests = [
    ...myInterests.slice(0, 5).map(item => ({ ...item, isMine: true })),
    ...topInterests.slice(0, 5).map(item => ({ ...item, isMine: false }))
  ];

  // 하단 서포터 공통 메뉴 (치트키/맛집 메뉴 제거 - 하단과 중복 방지)
  const baseMenus = [
    { label: "AI 매니저", path: "/ai-manager" },
    { label: "우리 어디서 만날까?", path: "/places" },
    { label: "Q&A", path: null },
    { label: "프로필", path: "/myPage" },
    { label: "로그아웃", action: "logout" },
  ];

  const handleMenuClick = (item) => {
    if (item.action === "logout") {
      alert("로그아웃 되었습니다.");
      navigate("/signIn");
    } else if (item.label === "Q&A") {
      setQnaStatus(true);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      {qnaStatus && <QnaModal isOpen={true} onClose={() => setQnaStatus(false)} />}
      <aside className="w-[360px] h-full bg-white border-r flex flex-col p-6 flex-shrink-0 overflow-hidden">
        
        {/* [1] 상단 로고 및 탭 */}
        <div className="flex flex-col items-center mb-6 flex-shrink-0">
          <div className="mb-8 cursor-pointer" onClick={() => navigate("/discovery")}>
            <img src="/logo.png" alt="Rendezvous" className="h-[80px] w-auto object-contain" />
          </div>
          <div className="flex gap-2 w-full p-1 bg-gray-50 rounded-full border border-gray-100">
            {["탐색", "매칭", "채팅"].map((tab) => (
              <button
                key={tab}
                onClick={() => navigate(tab === "탐색" ? "/discovery" : tab === "매칭" ? "/matching" : "/chat")}
                className={`flex-1 py-2 rounded-full font-bold text-[11px] transition-all ${
                  (tab === "탐색" && location.pathname === "/discovery") ||
                  (tab === "매칭" && location.pathname === "/matching") ||
                  (tab === "채팅" && location.pathname === "/chat")
                    ? "bg-[#FF4458] text-white shadow-sm" : "text-gray-400"
                }`}
              >
                {tab} {tab === "채팅" && <span className="ml-1 opacity-80">17</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          {!isMatchingOrChat ? (
            /* --- [2-A] 탐색 모드 사이드바 (내 설정 강조) --- */
            <div className="flex flex-col space-y-8">
              {/* 내 관계 설정 (연한 핑크 강조) */}
              <div className="px-1">
                <div className="aspect-square w-full border-2 border-[#FF4458] rounded-[40px] flex flex-col items-center justify-center bg-[#FFF0F2] shadow-sm p-4 text-center">
                  <span className="text-6xl mb-4">{myRelIntent.EMOJI || "🌹"}</span>
                  <p className="font-bold text-gray-800 text-lg">{myRelIntent.CODE_NAME}</p>
                  <p className="text-[10px] text-[#FF4458] font-bold mt-2 uppercase">내가 선택한 관계</p>
                </div>
              </div>

              {/* 공통 관심사 (내 항목 핑크 강조) */}
              <div className="px-1">
                <p className="text-[13px] font-black text-gray-900 mb-4 px-1">공통 관심사나 취미</p>
                <div className="grid grid-cols-2 gap-3">
                  {combinedInterests.map((interest, idx) => (
                    <div key={idx} className={`border rounded-2xl p-4 aspect-square flex flex-col items-center justify-center shadow-sm transition-all ${
                      interest.isMine ? "bg-[#FFF0F2] border-[#FFD1D9]" : "bg-white border-gray-100"
                    }`}>
                      <span className="text-4xl mb-3">{interest.EMOJI}</span>
                      <p className="text-[10px] font-bold text-gray-700 text-center leading-tight">{interest.CODE_NAME}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* --- [2-B] 매칭 모드 사이드바 (3개 버튼으로 간소화) --- */
            <div className="px-1 flex flex-col space-y-3">
              <p className="text-[13px] font-black text-gray-900 mb-2 px-1">매칭 리스트</p>
              {[
                { id: "received", label: "내가 받은 LIKE", emoji: "💌" },
                { id: "sent", label: "내가 보낸 LIKE", emoji: "📤" },
                { id: "matched", label: "서로 통한 LIKE", emoji: "❤️" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full p-5 rounded-2xl border transition-all flex items-center gap-4 ${
                    activeTab === tab.id 
                    ? "bg-[#FFF0F2] border-[#FF4458] text-[#FF4458] shadow-sm" 
                    : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-2xl">{tab.emoji}</span>
                  <span className="font-bold text-[13px]">{tab.label}</span>
                </button>
              ))}
              <p className="text-[10px] text-gray-300 px-2 mt-4 leading-relaxed">
                각 탭을 선택하면 메인 화면에서 상세한 인연의 정보를 확인할 수 있습니다.
              </p>
            </div>
          )}

          {/* [3] 공통 서포터 섹션 */}
          <div className="pt-8 pb-4 border-t border-gray-100 space-y-4 px-1 mt-10">
            <div>
              <p className="text-[12px] font-black text-gray-900">당신을 위한 든든한 서포터</p>
              <p className="text-[10px] text-gray-400 mt-1">성공적인 연애를 위해 꼼꼼히 챙겨드릴게요.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              {baseMenus.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item)}
                  className="w-full py-3 text-[11px] font-bold rounded-xl border border-gray-100 bg-white text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DiscoverySidebar;