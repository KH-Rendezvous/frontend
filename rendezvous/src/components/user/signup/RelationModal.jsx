import React, { useState, useEffect } from "react";

// 목업 이미지에 맞춘 더미 데이터
const RELATIONSHIP_TYPES = [
  { id: "진지한 연애", emoji: "💕", label: "진지한 연애" },
  { id: "천천히 서로 알아가기", emoji: "☕", label: "천천히 서로\n알아가기" },
  {
    id: "연애는 부담, 데이트만 선호",
    emoji: "🥂",
    label: "연애는 부담,\n데이트만 선호",
  },
  {
    id: "심심할 때 부를 술/밥 친구",
    emoji: "🍺",
    label: "심심할 때 부를\n술/밥 친구",
  },
  {
    id: "같이 취미 즐길 동네 친구",
    emoji: "🎧",
    label: "같이 취미 즐길\n동네 친구",
  },
  { id: "아직 모르겠음", emoji: "🧐", label: "아직 모르겠음" },
];

const RelationModal = ({ currentRelation, onClose, onSave }) => {
  const [selected, setSelected] = useState(currentRelation);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // 모달 등장 애니메이션 트리거
    setAnimate(true);
  }, []);

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleSave = () => {
    if (!selected) {
      alert("원하는 관계를 선택해주세요!");
      return;
    }
    onSave(selected);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity"
      onClick={onClose}
    >
      {/* 모달 컨테이너 */}
      <div
        className={`bg-white rounded-[32px] w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300 ${
          animate
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 영역 */}
        <div className="pt-10 pb-2 px-6 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
            내가 찾는 관계
          </h2>
          <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed font-medium">
            언제든 바꿀 수 있으니 너무 고민하지 마세요.
            <br />
            지금 이 순간, 가장 끌리는 것으로 편하게 선택해 주세요.
          </p>
        </div>

        {/* 카드 그리드 영역 */}
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {RELATIONSHIP_TYPES.map((item) => {
              const isSelected = selected === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`aspect-[4/5] rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-200 border-2 group ${
                    isSelected
                      ? "border-[#EE4B6F] bg-[#EE4B6F]/5 shadow-inner" // 선택됨
                      : "border-gray-100 bg-white hover:border-pink-200 hover:shadow-lg hover:-translate-y-1" // 기본
                  }`}
                >
                  <span
                    className={`text-4xl mb-3 transition-transform duration-300 ${isSelected ? "scale-110" : "group-hover:scale-110"}`}
                  >
                    {item.emoji}
                  </span>
                  <span
                    className={`text-sm font-bold text-center whitespace-pre-line leading-tight transition-colors ${
                      isSelected
                        ? "text-[#EE4B6F]"
                        : "text-gray-600 group-hover:text-gray-800"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 푸터 (저장 버튼) */}
        <div className="px-6 pb-8 pt-2">
          <button
            onClick={handleSave}
            disabled={!selected}
            className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all transform active:scale-[0.98] ${
              selected
                ? "bg-[#EE4B6F] hover:bg-[#E03A5F] shadow-pink-200"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelationModal;
