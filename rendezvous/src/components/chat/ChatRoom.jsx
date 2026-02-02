import React, { useState, useEffect } from "react";
import { Send, Image as ImageIcon } from "lucide-react";

const ChatRoom = ({ selectedUser }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      setChatHistory([
        { id: 1, sender: "other", text: "안녕하세요!", type: "text", time: "오후 10:12" },
        { id: 2, sender: "other", text: `저는 ${selectedUser.NICKNAME}에요! 반가워요 zeno님!`, type: "text", time: "오후 10:13" },
      ]);
    }
  }, [selectedUser]); // selectedUser가 바뀔 때마다 실행됨

  // [추가] 메시지 전송 핸들러 함수
  const handleSendMessage = () => {
    if (!message.trim()) return; 

    const now = new Date();
    const timeString = now.toLocaleTimeString("ko-KR", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true 
    }).replace("AM", "오전").replace("PM", "오후");

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: message,
      type: "text",
      time: timeString
    };

    setChatHistory((prev) => [...prev, newMessage]); // 기존 대화에 추가
    setMessage(""); // 입력창 초기화
  };

  // [수정] 엔터 키 입력 핸들러 (중복 전송 방지 처리)
  const handleKeyPress = (e) => {
    if (e.nativeEvent.isComposing) return;
    
    if (e.key === "Enter") {
      e.preventDefault(); // 엔터 키의 기본 동작(줄바꿈 등) 방지
      handleSendMessage();
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="flex-1 flex flex-col bg-white h-full border-r border-gray-100">
      {/* [수정] 상단 헤더에 선택된 유저의 이름을 출력합니다. */}
      <div className="py-4 text-center border-b border-gray-50 bg-white sticky top-0 z-10">
        <span className="text-xs text-gray-400 font-bold tracking-tight uppercase">
          2026. 02. 02. {selectedUser.NICKNAME}님과 매치되었습니다.
        </span>
      </div>

      {/* 실시간 대화 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white">
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            className={`flex ${chat.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-2 max-w-[85%] ${chat.sender === "me" ? "flex-row-reverse" : "flex-row"}`}>
              {/* [수정] 상대방일 때만 프로필 이미지 표시 (selectedUser 이미지 연동) */}
              {chat.sender === "other" && (
                <img
                  src={selectedUser.PHOTOS[0]}
                  className="w-9 h-9 rounded-full object-cover mt-1 flex-shrink-0 border border-gray-100 shadow-sm"
                  alt="profile"
                />
              )}

              <div className={`flex items-end gap-1.5 ${chat.sender === "me" ? "flex-row-reverse" : "flex-row"}`}>
                <div className="flex flex-col">
                  {chat.type === "text" ? (
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
                      <img src={chat.placeData.img} className="w-full h-28 object-cover" alt="place" />
                      <div className="p-3">
                        <p className="text-[11px] font-black text-gray-800 mb-1 truncate">{chat.placeData.title}</p>
                        <p className="text-[9px] text-gray-400 mb-3 italic">추천받은 장소</p>
                        <button className="w-full py-1.5 bg-gray-100 text-[10px] font-black rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">자세히 보기</button>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 min-w-max mb-0.5">{chat.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 메시지 입력창 영역 */}
      <div className="p-4 border-t border-gray-50 bg-white">
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 focus-within:border-pink-200 focus-within:bg-white transition-all shadow-sm">
          <input
            type="text"
            placeholder={`${selectedUser.NICKNAME}님에게 메시지 보내기...`}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-1 text-gray-700 font-bold"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress} // [추가] 엔터키 전송 이벤트 (isComposing 대응)
          />
          <button className="text-gray-300 hover:text-gray-500 transition-colors"><ImageIcon size={20} /></button>
          <button 
            onClick={handleSendMessage} // [추가] 클릭 전송 이벤트
            className="bg-[#FF4458] text-white px-5 py-1.5 rounded-full text-xs font-black hover:bg-[#e03e4e] active:scale-95 transition-all shadow-md"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;