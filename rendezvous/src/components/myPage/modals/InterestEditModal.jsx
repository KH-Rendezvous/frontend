import React, { useState, useEffect } from "react";

const INTEREST_LIST = [
  "MBTI",
  "맛집 탐방",
  "넷플릭스",
  "해외여행",
  "산책",
  "카페 투어",
  "헬스",
  "드라이브",
  "호캉스",
  "반려동물",
  "영화 감상",
  "와인/위스키",
  "전시회 관람",
  "유튜브",
  "테니스/골프",
  "주식/재테크",
  "온라인 게임",
  "캠핑/차박",
  "자기계발",
  "페스티벌",
  "코인 노래방",
  "진지한 대화",
  "쇼핑",
  "러닝",
  "독서",
  "보드게임",
  "워라밸",
  "요리",
  "사진 촬영",
  "자취",
  "콘솔 게임",
  "낚시",
  "직장생활",
  "스터디",
  "피아노",
  "명상",
  "여행",
  "클라이밍",
  "언어 교환",
  "웹툰",
];

const InterestEditModal = ({ currentInterests = [], onClose, onSave }) => {
  const [selected, setSelected] = useState(currentInterests);

  const [animate, setAnimate] = useState(false);

  // 혹시 모달이 열려있는 동안 부모 데이터가 바뀌면 동기화
  useEffect(() => {
    setSelected(currentInterests);
    // [2] 마운트 시 애니메이션 시작
    setAnimate(true);
  }, [currentInterests]);

  const toggleInterest = (item) => {
    if (selected.includes(item)) {
      // [해제] 이미 선택된 항목을 누르면 배열에서 제거
      setSelected(selected.filter((i) => i !== item));
    } else {
      // [선택] 선택되지 않은 항목을 누르면 추가 (최대 5개 제한)
      if (selected.length < 5) {
        setSelected([...selected, item]);
      } else {
        alert("관심사는 최대 5개까지 선택 가능합니다.");
      }
    }
  };

  const handleSave = () => {
    // 최소 3개 이상이면 통과
    if (selected.length < 3) {
      alert("관심사는 최소 3개 이상 선택해주세요!");
      return;
    }
    onSave(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`bg-white rounded-3xl w-full max-w-[600px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transform transition-all duration-300 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {/* 헤더 */}
        <div className="pt-10 pb-6 px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            요즘 진심인 관심사가 무엇인가요?
          </h2>
          <p className="text-gray-500 text-sm">
            내 취향을 공유하고 딱 맞는 인연을 찾아보세요.
          </p>
        </div>

        {/* 그리드 컨텐츠*/}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {INTEREST_LIST.map((item) => {
              const isActive = selected.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggleInterest(item)}
                  className={`py-2 px-1 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                    isActive
                      ? "bg-[#EE4B6F] border-[#EE4B6F] text-white shadow-md"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* 푸터 (저장 버튼) */}
        <div className="p-6 border-t border-gray-100 flex justify-center bg-white">
          <button
            onClick={handleSave}
            // [수정] 3개 이상이면 버튼 활성화
            className={`w-full max-w-xs py-3 rounded-full font-bold text-lg transition-colors shadow-md ${
              selected.length >= 3
                ? "bg-[#EE4B6F] text-white hover:bg-[#ff3b60]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={selected.length < 3}
          >
            {/* 텍스트도 조건에 따라 바꿈 */}
            {selected.length < 3
              ? `최소 3개 선택 (${selected.length}/5)`
              : `저장하기 (${selected.length}/5)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestEditModal;
