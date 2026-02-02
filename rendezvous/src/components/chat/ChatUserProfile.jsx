import React, { useState } from "react";
import { MapPin, ChevronDown, ChevronUp, Heart, Info } from "lucide-react";

const ChatUserProfile = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 상위에서 데이터가 안 넘어올 경우를 대비한 꼼꼼한 기본값 설정
  const userData = {
    NICKNAME: user?.NICKNAME || "Anna",
    AGE: user?.AGE || 25,
    CITY: user?.CITY || "서울특별시",
    PHOTOS: user?.PHOTOS || ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1"],
    BIO: user?.BIO || "안녕하세요! 좋은 인연 만들어가요!",
    // 에러 방지를 위해 빈 배열이라도 기본값으로 넣어줍니다.
    INTERESTS: user?.INTERESTS || [
      { EMOJI: "✈️", CODE_NAME: "여행" },
      { EMOJI: "📸", CODE_NAME: "사진" },
      { EMOJI: "🐶", CODE_NAME: "강아지" },
      { EMOJI: "🍷", CODE_NAME: "와인" }
    ],
    IDEAL_TYPE: user?.IDEAL_TYPE || "대화가 잘 통하는 사람이 좋아요."
  };

  return (
    <div className="w-[300px] h-full bg-white flex flex-col overflow-y-auto custom-scrollbar border-l border-gray-100">
      {/* 프로필 이미지 섹션 */}
      <div className="relative w-full aspect-[3/4] flex-shrink-0">
        <img 
          src={userData.PHOTOS[0]} 
          alt={userData.NICKNAME} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
          <h2 className="text-xl font-black">{userData.NICKNAME}, {userData.AGE}</h2>
          <p className="text-[10px] flex items-center gap-1 opacity-90"><MapPin size={12} /> {userData.CITY}</p>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* 기본 관계 설정 */}
        <section>
          <h4 className="text-[11px] font-black text-gray-800 mb-2 uppercase tracking-tighter italic flex items-center gap-1">
            <Heart size={12} className="text-[#FF4458]" /> Looking for
          </h4>
          <div className="bg-pink-50/50 p-3 rounded-xl border border-pink-100 flex items-center gap-2">
            <span className="text-xl">🌹</span>
            <span className="font-bold text-pink-600 text-xs">진지한 연애</span>
          </div>
        </section>

        {/* 자기소개 */}
        <section>
          <h4 className="text-[11px] font-black text-gray-800 mb-1 uppercase tracking-tighter italic flex items-center gap-1">
            <Info size={12} /> About Me
          </h4>
          <p className="text-gray-500 text-xs leading-relaxed font-bold">{userData.BIO}</p>
        </section>

        {/* --- 상세 정보 확장 섹션 --- */}
        <div className="pt-2 border-t border-gray-50">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 flex items-center justify-between text-[11px] font-black text-gray-400 hover:text-[#FF4458] transition-colors"
          >
            {isExpanded ? "상세 정보 접기" : "상세 정보 더보기"}
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {isExpanded && (
            <div className="mt-4 space-y-6">
              {/* 관심사/취미 - Optional Chaining(?.)을 사용하여 에러 방지 */}
              <section>
                <h4 className="text-[11px] font-black text-gray-800 mb-2 uppercase tracking-tighter italic">Interests</h4>
                <div className="grid grid-cols-2 gap-2">
                  {userData.INTERESTS?.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded-lg flex items-center gap-2 border border-gray-100">
                      <span className="text-sm">{item.EMOJI}</span>
                      <span className="text-[10px] font-bold text-gray-600">{item.CODE_NAME}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 이상형 정보 */}
              <section>
                <h4 className="text-[11px] font-black text-gray-800 mb-1 uppercase tracking-tighter italic">My Ideal Type</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed font-medium bg-gray-50 p-3 rounded-xl border border-gray-50">
                  {userData.IDEAL_TYPE}
                </p>
              </section>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="pt-4 space-y-2 border-t border-gray-50">
          <button className="w-full py-3.5 bg-gray-50 text-gray-800 text-[11px] font-black rounded-xl hover:bg-gray-100 border border-gray-100 transition-all">
            매칭 취소
          </button>
          <button className="w-full py-3.5 bg-white text-gray-400 text-[11px] font-black rounded-xl hover:text-gray-600 transition-all">
            {userData.NICKNAME}님 차단하기
          </button>
          <button className="w-full py-1 text-red-300 text-[10px] font-bold hover:text-red-500 transition-all">
            {userData.NICKNAME}님 신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUserProfile;