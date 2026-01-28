import React from "react";
import { MapPin } from "lucide-react";

const ChatUserProfile = ({ user }) => {
  // 임시데이터입니다
  
  const userData = user || {
    NICKNAME: "Anna",
    AGE: 25,
    CITY: "서울특별시",
    DISTANCE: 10,
    PHOTOS: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1"],
    BIO: "안녕하세요! 좋은 인연 만들어가요!"
  };

  return (
    <div className="w-[300px] h-full bg-white flex flex-col overflow-y-auto custom-scrollbar border-l border-gray-100">
     
      <div className="relative w-full aspect-[3/4]">
        <img 
          src={userData.PHOTOS ? userData.PHOTOS[0] : userData.PHOTO_URL} 
          alt="" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
          <h2 className="text-xl font-black">{userData.NICKNAME}, {userData.AGE}</h2>
          <p className="text-[10px] flex items-center gap-1 opacity-90"><MapPin size={12} /> {userData.CITY}</p>
        </div>
      </div>

      <div className="p-5 space-y-6">
        <section>
          <h4 className="text-[11px] font-black text-gray-800 mb-2 uppercase tracking-tighter italic">Looking for</h4>
          <div className="bg-pink-50/50 p-3 rounded-xl border border-pink-100 flex items-center gap-2">
            <span className="text-xl">🌹</span>
            <span className="font-bold text-pink-600 text-xs">진지한 연애</span>
          </div>
        </section>

        <section>
          <h4 className="text-[11px] font-black text-gray-800 mb-1 uppercase tracking-tighter italic">About Me</h4>
          <p className="text-gray-500 text-xs leading-relaxed font-bold">{userData.BIO}</p>
        </section>

        {/* 액션 버튼 */}
        <div className="pt-4 space-y-2">
          <button className="w-full py-3.5 bg-gray-50 text-gray-800 text-[11px] font-black rounded-xl hover:bg-gray-100 border border-gray-100 transition-all">
            매칭 취소
          </button>
          <button className="w-full py-3.5 bg-white text-gray-400 text-[11px] font-black rounded-xl hover:text-gray-600 transition-all">
            {userData.NICKNAME}님 차단하기
          </button>
          <button className="w-full py-1 text-red-400 text-[11px] font-black hover:text-red-500 transition-all">
            {userData.NICKNAME}님 신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUserProfile;