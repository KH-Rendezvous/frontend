import React, { useState, useEffect } from "react";

const InterestEditModal = ({
  allInterestOptions, // ★ 부모에서 넘겨준 DB 데이터
  currentInterests = [],
  onClose,
  onSave,
}) => {
  const [selected, setSelected] = useState(currentInterests);
  const [animate, setAnimate] = useState(false);

  // 부모 데이터 동기화 & 애니메이션 시작
  useEffect(() => {
    setSelected(currentInterests || []);
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      <div
        className={`bg-white rounded-3xl w-full max-w-[600px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transform transition-all duration-300 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        onClick={(e) => e.stopPropagation()} // 내부 클릭 전파 방지
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

        {/* 그리드 컨텐츠 */}
        <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {/* ★ DB 데이터 사용 (데이터 없으면 빈 배열 처리로 에러 방지) */}
            {(allInterestOptions || []).map((item) => {
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

            {/* 데이터 로딩 실패/지연 시 안내 문구 */}
            {(!allInterestOptions || allInterestOptions.length === 0) && (
              <div className="col-span-full py-10 text-center text-gray-400">
                관심사 목록을 불러오는 중입니다...
              </div>
            )}
          </div>
        </div>

        {/* 푸터 (저장 버튼) */}
        <div className="p-6 border-t border-gray-100 flex justify-center bg-white">
          <button
            onClick={handleSave}
            // 3개 이상이면 버튼 활성화
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
