import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 채팅 유저
  const [notifications, setNotifications] = useState([]); // 알림 목록

  const addNoti = (type, message, sender) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message, sender }]);
    
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ selectedUser, setSelectedUser, addNoti }}>
      {children}
      {/* 알림 팝업 렌더링 영역 */}
      <div className="fixed top-6 right-6 z-[9999] space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-2xl p-4 rounded-[24px] min-w-[300px] flex items-center gap-4 animate-in slide-in-from-right-full">
            <div className="w-10 h-10 bg-[#FFF0F2] rounded-full flex items-center justify-center text-xl shadow-sm">
              {n.type === 'match' ? '❤️' : n.type === 'like' ? '💌' : '💬'}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-[#FF4458] uppercase tracking-wider">{n.type} Notification</p>
              <p className="text-sm font-bold text-gray-800">{n.sender}: {n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNoti = () => useContext(NotificationContext);