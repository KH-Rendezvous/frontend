import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QnaModal from "../myPage/modals/QnAModal";
import { useNoti } from "../../context/NotificationContext"; // [추가] 알림 및 상태 공유 훅

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
  const [isAllMatchesOpen, setIsAllMatchesOpen] = useState(false); // [추가] 전체보기 모달 상태
  const navigate = useNavigate();
  const location = useLocation();
  
  // [추가] 전역 알림 및 유저 선택 함수 가져오기
  const { setSelectedUser, addNoti } = useNoti();

  const isMatching = location.pathname === "/matching";
  const isChat = location.pathname === "/chat";
  const isMatchingOrChat = isMatching || isChat;

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

  // [추가] 채팅 모드용 가로 스크롤 임시 데이터
  const newMatches = [
    { id: 10, name: "Holm", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9" },
    { id: 11, name: "Amanda", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" },
    { id: 12, name: "Jay", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2" },
    { id: 13, name: "Wendy", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
    { id: 14, name: "Sarah", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1" },
  ];

  // [수정] 새로운 매치 클릭 시 채팅방 시작 핸들러 (전역 상태 연동)
  const handleStartChat = (user) => {
    // [수정] 전역 상태에 유저 정보 저장 (ChatPage와 ChatUserProfile이 이를 감지하여 변경됨)
    setSelectedUser({
      ...user,
      NICKNAME: user.name,
      PHOTOS: [user.img],
      AGE: 25,
      CITY: "서울특별시",
      DISTANCE: 12,
      BIO: "반가워요! 우리 같이 대화 나눠요."
    });

    // [추가] 클릭 시 알림 테스트 (선택 사항 - 실제 작동 확인용)
    addNoti("chat", "새로운 대화가 시작되었습니다.", user.name);

    setIsAllMatchesOpen(false); // 모달이 열려있다면 닫아줍니다.
    
    // 현재 페이지가 채팅 페이지가 아니라면 이동시켜줍니다.
    if (!isChat) navigate("/chat");
  };

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
      
      {/* [추가] 전체보기(View All) 모달 UI - 사람이 늘어날 경우를 대비 */}
      {isAllMatchesOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[40px] max-h-[80vh] overflow-hidden flex flex-col shadow-2xl scale-in-center">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">All New Matches</h3>
                <p className="text-xs text-gray-400 font-bold mt-1">대화를 기다리고 있는 새로운 인연들입니다.</p>
              </div>
              <button onClick={() => setIsAllMatchesOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors font-bold">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <div className="grid grid-cols-4 gap-8">
                {newMatches.map((match) => (
                  <div key={match.id} onClick={() => handleStartChat(match)} className="flex flex-col items-center gap-3 cursor-pointer group">
                    <div className="relative w-full aspect-square rounded-[32px] overflow-hidden border-2 border-transparent group-hover:border-[#FF4458] transition-all p-1 shadow-sm">
                      <img src={match.img} className="w-full h-full object-cover rounded-[24px]" alt="" />
                    </div>
                    <span className="text-xs font-black text-gray-700 group-hover:text-[#FF4458]">{match.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <aside className="w-[360px] h-full bg-white border-r flex flex-col p-6 flex-shrink-0 overflow-hidden">
        
        {/* [1] 상단 로고 및 탭 */}
        <div className="flex flex-col items-center mb-6 flex-shrink-0">
          <div className="mb-8 cursor-pointer transform hover:scale-105 transition-transform" onClick={() => navigate("/discovery")}>
            <img src="/logo.png" alt="Rendezvous" className="h-[80px] w-auto object-contain" />
          </div>
          <div className="flex gap-2 w-full p-1 bg-gray-50 rounded-full border border-gray-100">
            {["탐색", "매칭", "채팅"].map((tab) => (
              <button
                key={tab}
                onClick={() => navigate(tab === "탐색" ? "/discovery" : tab === "매칭" ? "/matching" : "/chat")}
                className={`flex-1 py-2 rounded-full font-bold text-[11px] transition-all active:scale-95 ${
                  (tab === "탐색" && location.pathname === "/discovery") ||
                  (tab === "매칭" && location.pathname === "/matching") ||
                  (tab === "채팅" && isChat)
                    ? "bg-[#FF4458] text-white shadow-sm" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
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
              {/* 내 관계 설정 (연한 핑크 강조 + 호버 효과) */}
              <div className="px-1">
                <div className="aspect-square w-full border-2 border-[#FF4458] rounded-[40px] flex flex-col items-center justify-center bg-[#FFF0F2] shadow-sm p-4 text-center cursor-pointer hover:bg-[#FFE4E8] hover:shadow-md transition-all active:scale-[0.98]">
                  <span className="text-6xl mb-4">{myRelIntent.EMOJI || "🌹"}</span>
                  <p className="font-bold text-gray-800 text-lg">{myRelIntent.CODE_NAME}</p>
                  <p className="text-[10px] text-[#FF4458] font-bold mt-2 uppercase">내가 선택한 관계</p>
                </div>
              </div>

              {/* 공통 관심사 (내 항목 핑크 강조 + 호버 시 스케일 업) */}
              <div className="px-1">
                <p className="text-[13px] font-black text-gray-900 mb-4 px-1">공통 관심사나 취미</p>
                <div className="grid grid-cols-2 gap-3">
                  {combinedInterests.map((interest, idx) => (
                    <div key={idx} className={`border rounded-2xl p-4 aspect-square flex flex-col items-center justify-center shadow-sm transition-all cursor-pointer group active:scale-95 ${
                      interest.isMine 
                      ? "bg-[#FFF0F2] border-[#FFD1D9] hover:bg-[#FFE4E8]" 
                      : "bg-white border-gray-100 hover:border-pink-200 hover:bg-gray-50"
                    }`}>
                      <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{interest.EMOJI}</span>
                      <p className="text-[10px] font-bold text-gray-700 text-center leading-tight group-hover:text-[#FF4458] transition-colors">{interest.CODE_NAME}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : isMatching ? (
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
                  className={`w-full p-5 rounded-2xl border transition-all flex items-center gap-4 active:scale-[0.98] ${
                    activeTab === tab.id 
                    ? "bg-[#FFF0F2] border-[#FF4458] text-[#FF4458] shadow-sm" 
                    : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">{tab.emoji}</span>
                  <span className="font-bold text-[13px]">{tab.label}</span>
                </button>
              ))}
              <p className="text-[10px] text-gray-300 px-2 mt-4 leading-relaxed">
                각 탭을 선택하면 메인 화면에서 상세한 인연의 정보를 확인할 수 있습니다.
              </p>
            </div>
          ) : (
            /* --- [2-C] 채팅 모드 사이드바 (가로 스크롤 매칭 + 세로 리스트) --- */
            <div className="flex flex-col space-y-8 px-1">
              {/* 새로운 인연 (가로 스크롤 - 사람이 많아져도 스크롤로 대응 가능) */}
              <div>
                <div className="flex justify-between items-center mb-4 px-1">
                  <p className="text-[12px] font-black text-gray-900 uppercase italic tracking-tighter">New Matches</p>
                  <button 
                    onClick={() => setIsAllMatchesOpen(true)}
                    className="text-[10px] font-bold text-gray-400 hover:text-[#FF4458] transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth">
                  {newMatches.map((match) => (
                    <div 
                      key={match.id} 
                      onClick={() => handleStartChat(match)}
                      className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-100 group-hover:border-[#FF4458] p-0.5 transition-all group-hover:scale-105 active:scale-95 shadow-sm">
                        <img src={match.img} className="w-full h-full object-cover rounded-[14px]" alt={match.name} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 group-hover:text-[#FF4458] transition-colors">{match.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 진행 중인 대화 (세로 리스트) */}
              <div>
                <p className="text-[12px] font-black text-gray-900 mb-4 px-1 uppercase italic tracking-tighter">Messages</p>
                <div className="space-y-2">
                  <div 
                    onClick={() => handleStartChat({ name: "Anna", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1" })}
                    className="flex items-center gap-4 p-4 -mx-2 bg-white rounded-2xl border-l-4 border-transparent cursor-pointer transition-all hover:bg-pink-50/50 hover:border-[#FF4458] active:scale-[0.98] group"
                  >
                    <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1" className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:shadow-md transition-shadow" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-black text-sm text-gray-800 group-hover:text-[#FF4458] transition-colors">Anna</span>
                        <span className="text-[9px] text-gray-400">오후 10:27</span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-bold truncate group-hover:text-gray-600">오 저도에요! :)</p>
                    </div>
                    <div className="bg-[#FF4458] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">3</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* [3] 공통 서포터 섹션 (버튼 호버 강조) */}
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
                  className="w-full py-3 text-[11px] font-bold rounded-xl border border-gray-100 bg-white text-gray-600 hover:bg-gray-50 hover:border-[#FF4458] hover:text-[#FF4458] transition-all shadow-sm active:scale-95"
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