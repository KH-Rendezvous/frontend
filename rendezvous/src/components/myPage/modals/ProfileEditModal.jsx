import React, { useState, useEffect } from "react";

const ProfileEditModal = ({
  title,
  type,
  options,
  defaultValue,
  onClose,
  onSave,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    setInternalValue(defaultValue);
  }, [defaultValue]);

  // 값 변경 핸들러
  const handleChange = (e) => {
    let val = e.target.value;

    // 타입이 'number'일 때(키 입력 등)는 숫자만 입력되게 필터링
    if (type === "number") {
      val = val.replace(/[^0-9]/g, "");
    }

    setInternalValue(val);
  };

  const handleSave = () => {
    onSave(internalValue);
  };

  return (
    // 배경 클릭 시 닫기 (onClose)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* 내부 클릭 전파 방지 */}
      <div
        className={`bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden transform transition-all duration-300 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="pt-8 pb-4 px-6 text-center">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>

        {/* 바디 (입력 폼) */}
        <div className="px-6 py-4">
          {type === "select" ? (
            // 셀렉트 박스 (MBTI, 흡연 등)
            <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto custom-scrollbar">
              {(options || []).map((option) => (
                <button
                  key={option}
                  onClick={() => setInternalValue(option)}
                  className={`py-3 px-4 rounded-xl text-left text-sm font-medium transition-all ${
                    internalValue === option
                      ? "bg-[#EE4B6F] text-white shadow-md"
                      : "bg-gray-50 text-black hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {internalValue === option && <span>✓</span>}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // 텍스트/숫자 입력 (키, 학교 등)
            <div className="relative flex items-center">
              <input
                type={type === "number" ? "text" : "text"} // 모바일 키패드 이슈 방지 위해 text로 하되 정규식으로 제어
                inputMode={type === "number" ? "numeric" : "text"} // 모바일에서 숫자 키패드 뜨게 설정
                value={internalValue}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg rounded-xl focus:ring-2 focus:ring-[#EE4B6F] focus:border-transparent block p-4 pr-12 text-center outline-none transition-all placeholder-gray-400"
                autoFocus
              />

              {/*숫자 타입일 때 우측에 'cm' 표시 */}
              {type === "number" && (
                <span className="absolute right-5 text-gray-500 font-bold">
                  cm
                </span>
              )}
            </div>
          )}
        </div>

        {/* 푸터 (버튼 영역) - 수정됨 */}
        <div className="p-6 pt-2 flex justify-center">
          <button
            onClick={handleSave}
            className="w-40 bg-[#EE4B6F] hover:bg-[#ff3b60] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors text-lg"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
