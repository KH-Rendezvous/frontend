import React, { useState } from "react";

const BlockModal = ({ isOpen, onClose }) => {
  // 모달이 닫혀있으면 아무것도 안 보여줌
  if (!isOpen) return null;

  return (
    // 1. 배경 (검은색 반투명) - 클릭하면 닫히게 처리
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* 2. 모달 창 본문 (클릭해도 안 닫히게 e.stopPropagation) */}
      <div
        className="bg-white w-[90%] max-w-md rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- 폼 시작 --- */}
        <div className="flex flex-col">
          {/* 이름 섹션 */}
          <div className="bg-gray-100 px-5 py-3 border-y border-gray-200">
            <h3 className="text-sm font-bold text-gray-700">이름</h3>
          </div>
          <div className="px-5 py-4 bg-white">
            <input
              type="text"
              placeholder="이름 입력"
              className="w-full text-sm outline-none placeholder-gray-400 text-gray-800"
            />
          </div>

          {/* 연락처 정보 헤더 */}
          <div className="bg-gray-100 px-5 py-3 border-y border-gray-200">
            <h3 className="text-sm font-bold text-gray-700">연락처 정보</h3>
            <p className="text-xs text-gray-500 mt-1">
              전화번호나 이메일 주소를 입력하세요
            </p>
          </div>

          {/* 전화번호 입력 */}
          <div className="bg-white border-b border-gray-100">
            <div className="px-5 py-2 text-xs text-gray-500 mt-2">전화번호</div>
            <div className="px-5 pb-4">
              <input
                type="tel"
                placeholder="전화번호 입력"
                className="w-full text-sm outline-none placeholder-gray-400 text-gray-800"
              />
            </div>
          </div>

          {/* 이메일 입력 */}
          <div className="bg-white">
            <div className="px-5 py-2 text-xs text-gray-500 mt-2">이메일</div>
            <div className="px-5 pb-4">
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                className="w-full text-sm outline-none placeholder-gray-400 text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="p-5 bg-gray-50 border-t border-gray-200">
          <button
            className="w-full bg-[#ff4b6e] hover:bg-[#ff3b60] text-white font-bold py-3 rounded-lg transition-colors"
            onClick={() => {
              alert("차단 요청 전송됨 (기능은 나중에 구현)");
              onClose();
            }}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockModal;
