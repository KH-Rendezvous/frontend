import React from "react";

const ChatList = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-50">
        <h2 className="text-xl font-black text-gray-800">메시지</h2>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* 임시데이터 입니다 */}
        <div className="p-4 flex items-center gap-4 bg-pink-50/30 cursor-pointer border-l-4 border-[#FF4458]">
          <img 
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1" 
            className="w-14 h-14 rounded-full object-cover" 
            alt="Anna" 
          />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-black text-sm text-gray-800">Anna</span>
              <span className="text-[10px] text-gray-400">오후 10:27</span>
            </div>
            <p className="text-[11px] text-[#FF4458] font-bold truncate">오 저도에요! :)</p>
          </div>
          <div className="bg-[#FF4458] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">3</div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;