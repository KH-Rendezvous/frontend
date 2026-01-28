import React from "react";
import ChatList from "../../components/chat/ChatList";
import ChatRoom from "../../components/chat/ChatRoom";
import ChatUserProfile from "../../components/chat/ChatUserProfile";

const ChatPage = () => {
  // 임시 데이터 ㄴ
  const currentChatUser = {
    NICKNAME: "Anna",
    AGE: 25,
    CITY: "서울특별시",
    DISTANCE: 10,
    PHOTOS: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1"],
    BIO: "안녕하세요! 좋은 인연 만들어가요!",
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">

      <div className="w-[320px] h-full border-r border-gray-100 flex flex-col">
        <ChatList />
      </div>

      <div className="flex-1 h-full flex flex-col min-w-[400px]">
        <ChatRoom />
      </div>

      <div className="w-[300px] h-full">
        <ChatUserProfile user={currentChatUser} />
      </div>
    </div>
  );
};

export default ChatPage;