import React, { useState } from "react";
import { Send, Image as ImageIcon } from "lucide-react";

const ChatRoom = () => {
  const [message, setMessage] = useState("");

  // 임시 데이터! 나중에 세부 기능들로 정확하게 넘어오게 할거임!
  const chatHistory = [
    { id: 1, sender: "me", text: "안녕하세요!", type: "text" },
    { id: 2, sender: "other", text: "반가워요!", type: "text" },
    { id: 3, sender: "other", text: "저는 Anna에요!", type: "text" },
    { id: 4, sender: "me", text: "저는 zeno에요! 만나서 반가워요!", type: "text" },
    { id: 5, sender: "other", text: "취미가 뭐에요?", type: "text" },
    { id: 6, sender: "me", text: "카페 다니기요!", type: "text" },
    { id: 7, sender: "other", text: "오 저도에요! :)", type: "text" },
    {
      id: 8,
      sender: "me",
      type: "place",
      placeData: {
        title: "투썸플레이스 강서구청점",
        img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
        address: "서울 강서구 화곡로"
      }
    },
    { id: 9, sender: "me", text: "여기 어떠신가요?!", type: "text" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white h-full border-r border-gray-100">
      {/* 상단 매칭 정보 헤더 */}
      <div className="py-4 text-center border-b border-gray-50">
        <span className="text-sm text-gray-400 font-medium">
          2026. 01. 18. Anna님과 매치되었습니다.
        </span>
      </div>

      {/* 실시간 대화 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white">
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            className={`flex ${chat.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex gap-2 max-w-[75%]">
              {/* 상대방일 때만 프로필 이미지 표시 */}
              {chat.sender === "other" && (
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1"
                  className="w-9 h-9 rounded-full object-cover mt-1 flex-shrink-0"
                  alt="profile"
                />
              )}

              <div className="flex flex-col">
                {chat.type === "text" ? (
                  /* 텍스트 말풍선 스타일 */
                  <div
                    className={`px-4 py-2 rounded-2xl text-[13px] font-bold shadow-sm ${
                      chat.sender === "me"
                        ? "bg-[#FF4458] text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {chat.text}
                  </div>
                ) : (
                  /* 장소 공유 카드 스타일 (우리 어디서 만날까 연동용) */
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg w-52 transform transition-transform hover:scale-[1.02] cursor-pointer">
                    <img
                      src={chat.placeData.img}
                      className="w-full h-28 object-cover"
                      alt="place"
                    />
                    <div className="p-3">
                      <p className="text-[11px] font-black text-gray-800 mb-1 truncate">
                        {chat.placeData.title}
                      </p>
                      <p className="text-[9px] text-gray-400 mb-3 italic">추천받은 장소</p>
                      <button className="w-full py-1.5 bg-gray-100 text-[10px] font-black rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
                        자세히 보기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 메시지 입력창 영역 */}
      <div className="p-4 border-t border-gray-50 bg-white">
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 focus-within:border-pink-200 focus-within:bg-white transition-all">
          <input
            type="text"
            placeholder="메시지를 입력하세요."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-1 text-gray-700"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="text-gray-300 hover:text-gray-500 transition-colors">
            <ImageIcon size={20} />
          </button>
          <button className="bg-[#FF4458] text-white px-5 py-1.5 rounded-full text-xs font-black hover:bg-[#e03e4e] active:scale-95 transition-all shadow-md">
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;