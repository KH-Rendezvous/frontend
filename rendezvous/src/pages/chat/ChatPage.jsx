import React from "react";
import { useNoti } from "../../context/NotificationContext"; // [수정] Context 훅 가져오기
import ChatRoom from "../../components/chat/ChatRoom";
import ChatUserProfile from "../../components/chat/ChatUserProfile";

const ChatPage = () => {
  // [수정] 로컬 상태 대신 전역 상태(Context)를 사용합니다.
  const { selectedUser } = useNoti();

  return (
    <div className="flex flex-1 h-full bg-white overflow-hidden">
      
      {/* 1. 중앙 채팅방 영역 */}
      <div className="flex-1 h-full flex flex-col min-w-[400px] border-r border-gray-100">
        {selectedUser ? (
          <ChatRoom selectedUser={selectedUser} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <p className="font-bold text-sm">대화할 상대를 선택해주세요.</p>
          </div>
        )}
      </div>

      {/* 2. 오른쪽 유저 프로필 영역 */}
      <div className="w-[300px] h-full flex-shrink-0 bg-white">
        {/* [수정] selectedUser가 있을 때만 렌더링하도록 일관성 유지 */}
        {selectedUser && <ChatUserProfile user={selectedUser} />}
      </div>

    </div>
  );
};

export default ChatPage;