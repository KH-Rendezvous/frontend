import React, { useState, useEffect } from "react";
// import axios from "axios"; // 안 쓰면 삭제
import { axiosApi } from "../../../api/axiosAPI";

const GenderModal = ({ isOpen, onClose, currentGender, onSave, memberNo }) => {
  // 모달 내부 선택값 (초기값은 부모가 준 현재 성별)
  const [selected, setSelected] = useState(currentGender);

  // 모달 열릴 때마다 부모 값(currentGender)과 동기화
  useEffect(() => {
    if (currentGender === "전체") {
      setSelected("모든 성별");
    } else {
      setSelected(currentGender);
    }
  }, [isOpen, currentGender]);

  // 저장 핸들러 (API 호출 로직 내장)
  const handleSave = async () => {
    if (!memberNo) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 1. 서버에 보낼 코드로 변환 (UI 텍스트 -> DB 코드)
    let code = "A";
    if (selected === "남성") code = "M";
    else if (selected === "여성") code = "F";
    // "모든 성별"이면 기본값 "A"

    try {
      // 2. 서버 통신
      const response = await axiosApi.put("/api/mypage/gender", {
        memberNo: memberNo,
        targetGender: code,
      });

      if (response.data.result === "success") {
        onSave(selected);
        onClose();
      } else {
        alert("성별 변경 실패");
      }
    } catch (error) {
      console.error("성별 변경 에러:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  const options = ["모든 성별", "여성", "남성"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] max-w-xs rounded-xl shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">보고 싶은 성별</h3>
        </div>

        {/* 선택 리스트 */}
        <div className="flex flex-col">
          {options.map((option) => (
            <label
              key={option}
              className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
            >
              <span
                className={`text-sm font-medium ${selected === option ? "text-[#ff4b6e]" : "text-gray-700"}`}
              >
                {option}
              </span>

              {/* 라디오 버튼 (숨김) */}
              <input
                type="radio"
                name="gender"
                value={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
                className="hidden"
              />

              {/* 커스텀 체크 표시 */}
              {selected === option && (
                <span className="text-[#EE4B6F] font-bold text-lg">✓</span>
              )}
            </label>
          ))}
        </div>

        {/* 하단 저장 버튼 */}
        <div className="p-4 bg-gray-50">
          <button
            className="w-full bg-[#ff4b6e] hover:bg-[#ff3b60] text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
            onClick={handleSave}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenderModal;
