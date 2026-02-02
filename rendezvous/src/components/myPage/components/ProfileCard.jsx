import React, { useState } from "react";

const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);

const ProfileCard = ({ userData }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. 실제 이미지 데이터 추출 (빈 슬롯 제거)
  const validImages = userData.profileImages
    ? userData.profileImages.filter((img) => img !== null).map((img) => img.url)
    : [];

  // 2. 이미지가 하나도 없으면 기본 이미지 사용
  const photos =
    validImages.length > 0 ? validImages : ["/images/default_profile.png"];

  const aboutMe = [
    { label: "애정표현 스타일", value: userData.affection, icon: "☘️" },
    { label: "학력", value: userData.education, icon: "🎓" },
    { label: "연락 스타일", value: userData.contact, icon: "💌" },
    { label: "별자리", value: userData.zodiac, icon: "🌌" },
    { label: "MBTI", value: userData.mbti, icon: "📋" },
  ];

  const lifestyle = [
    { label: "운동", value: userData.exercise, icon: "💪" },
    { label: "음주", value: userData.drinking, icon: "🍺" },
    { label: "흡연", value: userData.smoking, icon: "🚭" },
    { label: "소셜 미디어", value: userData.social, icon: "⭐" },
  ];

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full max-w-[400px] bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-200 mx-auto relative group">
      {/* --- [A] 상단 사진 슬라이더 --- */}
      <div className="relative w-full h-[520px] bg-gray-800">
        {/* 인디케이터 (사진이 2장 이상일 때만 표시) */}
        {photos.length > 1 && (
          <div className="absolute top-3 left-0 w-full px-2 z-20 flex gap-1">
            {photos.map((_, idx) => (
              <div
                key={idx}
                className="h-1 rounded-full flex-1 bg-white/30 overflow-hidden"
              >
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    idx === currentIdx ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* 이미지 슬라이드 */}
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIdx * 100}%)` }}
        >
          {photos.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`profile-${idx}`}
              className="w-full h-full object-cover shrink-0"
              onError={(e) => {
                e.target.src = "/images/default_profile.png";
              }}
            />
          ))}
        </div>

        {/* 좌우 버튼 (사진이 2장 이상일 때만 표시) */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform z-20 cursor-pointer hover:bg-white"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform z-20 cursor-pointer hover:bg-white"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* 하단 그라데이션 & 이름/나이/지역 */}
        <div
          className="absolute bottom-0 left-0 w-full p-5 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white z-10 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* 🔥 [수정] 니가 원한 대로 "25"로 원상복구 했다. */}
          <h2 className="text-3xl font-bold drop-shadow-md">
            {userData.nickname || "이름없음"}, {userData.age || "25"}
          </h2>
          <div className="flex items-center gap-1 mt-1 text-sm font-medium opacity-90">
            <span>🏠</span>
            <span>{userData.region || "지역 미설정"}</span>
          </div>
        </div>
      </div>

      {/* --- [B] 하단 상세 정보 --- */}
      <div
        className={`bg-white transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-5 space-y-6 pb-10">
          {/* 1. 내가 찾는 관계 */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
              내가 찾는 관계
            </h3>
            <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
              {userData.relationship || "정보 없음"}
            </div>
          </section>

          {/* 2. 자기소개 */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
              자기소개
            </h3>
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100">
              {userData.intro || "자기소개가 없습니다."}
            </p>
          </section>

          {/* 3. 기본 정보 (학교, 키) */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
              기본 정보
            </h3>
            <div className="space-y-3">
              {/* 학교 */}
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏫</span>
                  <span className="text-sm text-gray-600 font-medium">
                    학교
                  </span>
                </div>
                <span className="text-sm text-gray-900 font-bold">
                  {userData.school || "미입력"}
                </span>
              </div>

              {/* 키 */}
              <div className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📏</span>
                  <span className="text-sm text-gray-600 font-medium">키</span>
                </div>
                <span className="text-sm text-gray-900 font-bold">
                  {userData.height ? `${userData.height}cm` : "미입력"}
                </span>
              </div>
            </div>
          </section>

          {/* 4. Detail (상세 정보) */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
              Detail
            </h3>
            <div className="space-y-3">
              {aboutMe.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-gray-600 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900 font-bold">
                    {item.value || "-"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Lifestyle */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
              Lifestyle
            </h3>
            <div className="space-y-3">
              {lifestyle.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-gray-600 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900 font-bold">
                    {item.value || "-"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Interests */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {userData.interests && userData.interests.length > 0 ? (
                userData.interests.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-[#EE4B6F]/10 text-[#EE4B6F] text-xs font-bold rounded-full border border-[#EE4B6F]/20"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">
                  선택된 관심사가 없습니다.
                </span>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* --- [C] 접기/펼치기 버튼 --- */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-4 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors border-t border-gray-100 cursor-pointer"
      >
        <span className="text-sm font-bold text-gray-500 mr-1">
          {isExpanded ? "프로필 접기" : "상세 프로필 보기"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default ProfileCard;
