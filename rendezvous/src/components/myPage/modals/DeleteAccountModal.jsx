import React, { useState } from "react";

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [isChecked, setIsChecked] = useState(false);

  // 모달 닫힐 때 체크박스 초기화
  const handleClose = () => {
    setIsChecked(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 배경: 블러 + 어둡게 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* 모달 본체 */}
      <div className="relative w-[90%] max-w-[420px] bg-white rounded-3xl p-8 shadow-2xl transform transition-all animate-fadeInUp overflow-hidden">
        {/* 상단 경고 데코레이션 (빨간색) */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />

        {/* 헤더: 아이콘 + 제목 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">회원 탈퇴</h2>
          <p className="text-sm text-gray-500 mt-2">
            탈퇴 시 계정은 즉시 삭제되며,
            <br />
            모든 데이터는{" "}
            <span className="text-red-500 font-bold">복구할 수 없습니다.</span>
          </p>
        </div>

        {/* 삭제 데이터 목록 박스 */}
        <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            삭제되는 정보
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span> 모든 프로필 정보 및
              사진
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span> 나의 하트 및 좋아요
              기록
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span> 매칭 내역 및 모든
              채팅방 기록
            </li>
          </ul>
        </div>

        {/* 동의 체크박스 */}
        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isChecked ? "bg-red-500 border-red-500" : "border-gray-300 bg-white group-hover:border-red-400"}`}
            >
              {isChecked && (
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <span className="text-sm text-gray-600 font-medium select-none">
              위 내용을 모두 확인했으며, 이에 동의합니다.
            </span>
          </label>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-3.5 px-6 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            disabled={!isChecked}
            className={`flex-[2] py-3.5 px-6 rounded-xl text-white font-bold shadow-lg transition-all duration-200
              ${
                isChecked
                  ? "bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5"
                  : "bg-gray-300 cursor-not-allowed shadow-none"
              }`}
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
