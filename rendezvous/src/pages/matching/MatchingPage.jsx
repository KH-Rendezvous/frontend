import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const MatchingPage = () => {
  const navigate = useNavigate();
  // MainLayout에서 관리되는 activeTab 상태를 가져옵니다.
  const { activeTab } = useOutletContext(); 

  // 임시 데이터 
  const mockData = {
    received: [
      { id: 1, name: "Holm", age: 34, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9", location: "Seoul" },
      { id: 2, name: "Amanda", age: 34, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80", location: "Incheon" },
    ],
    sent: [
      { id: 3, name: "Jay", age: 34, photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2", location: "Seoul" },
      { id: 4, name: "Anna", age: 34, photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1", location: "Gyeonggi" },
    ],
    matched: [
      { id: 5, name: "Wendy", age: 34, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", location: "Seoul" },
      { id: 6, name: "Dana", age: 34, photo: "https://images.unsplash.com/photo-1491349174775-aaaf9439b401", location: "Seoul" },
      { id: 7, name: "Ally", age: 34, photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce", location: "Seoul" },
      { id: 8, name: "Hash", age: 34, photo: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe", location: "Busan" },
      { id: 9, name: "Chary", age: 34, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", location: "Seoul" },
      { id: 10, name: "Veina", age: 34, photo: "https://images.unsplash.com/photo-1554151228-14d9def656e4", location: "Seoul" },
    ]
  };

  const handleUserClick = (user) => {
    if (activeTab === "matched") {
      navigate("/chat", { state: { selectedUser: user } });
    } else {
      alert("서로 LIKE가 되어야 채팅이 가능합니다!");
    }
  };

  // 사이드바 선택 상태에 따른 메인 헤더 타이틀
  const getHeaderTitle = () => {
    const list = mockData[activeTab] || [];
    if (activeTab === "received") return `❤️ LIKE ${list.length}개`;
    if (activeTab === "sent") return `❤️ 내가 보낸 LIKE ${list.length}개`;
    return `❤️ 서로 LIKE한 인연 ${list.length}명`;
  };

  return (
    <div className="flex-1 bg-white h-screen overflow-y-auto custom-scrollbar">
      {/* 상단 헤더 영역 */}
      <div className="px-10 py-6 border-b border-gray-100 flex items-center gap-2 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">
          {getHeaderTitle()}
        </h2>
      </div>

      {/* 메인 리스트 그리드 영역 */}
      <div className="p-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {(mockData[activeTab] || []).map((user) => (
            <div 
              key={user.id} 
              onClick={() => handleUserClick(user)} 
              className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-black text-lg drop-shadow-md tracking-tight">{user.name}, {user.age}</p>
                {activeTab === "matched" && (
                  <span className="text-[10px] bg-[#FF4458] px-2 py-0.5 rounded-full font-bold">MATCHED</span>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* 리스트가 없을 때 예외 처리 */}
        {(!mockData[activeTab] || mockData[activeTab].length === 0) && (
          <div className="py-20 text-center text-gray-300 font-bold">표시할 유저가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MatchingPage;