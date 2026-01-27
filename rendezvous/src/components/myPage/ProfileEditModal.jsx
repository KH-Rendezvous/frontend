import React, { useState } from "react";

const ProfileEditModal = ({
  title,
  type,
  options,
  defaultValue,
  onClose,
  onSave,
}) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* 배경 (클릭 시 닫힘) */}
      <div
        className="absolute inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      ></div>

      {/* 모달 컨텐츠 */}
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative z-10 shadow-2xl animate-fade-in-up">
        <h3 className="text-lg font-bold text-center mb-6 text-gray-800">
          {title}
        </h3>

        <div className="mb-8">
          {type === "select" ? (
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => setValue(option)}
                  className={`py-3 px-2 rounded-xl text-sm font-medium border transition-all ${
                    value === option
                      ? "border-[#EE4B6F] text-[#EE4B6F] bg-[#EE4B6F]/5"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border-b-2 border-gray-300 py-2 text-center text-lg focus:border-[#EE4B6F] outline-none transition-colors"
              placeholder={`${title}을(를) 입력하세요`}
              autoFocus
            />
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => onSave(value)}
            className="flex-1 py-3 rounded-xl bg-[#EE4B6F] text-white font-bold text-sm hover:bg-[#ff3b60] shadow-md transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
