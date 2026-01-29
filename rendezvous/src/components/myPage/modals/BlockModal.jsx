import React, { useState } from "react";
import axios from "axios"; // ★ axios 임포트 필수

const BlockModal = ({ isOpen, onClose }) => {
  // 1. 입력값 관리용 State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 2. 전송 버튼 클릭 핸들러 (백엔드 통신)
  const handleSubmit = async () => {
    // 유효성 검사: 최소한 정보 하나는 있어야 함
    if (!formData.name && !formData.phone && !formData.email) {
      alert("차단할 사람의 정보를 하나라도 입력해주세요.");
      return;
    }

    if (!window.confirm("입력한 연락처를 차단하시겠습니까?")) return;

    try {
      // ★ 백엔드 DTO 필드명(targetName 등)에 맞춰서 매핑해서 보냄
      const response = await axios.post("http://localhost/api/block/insert", {
        targetName: formData.name,
        targetPhone: formData.phone,
        targetEmail: formData.email,
      });

      if (response.data === "success") {
        alert("성공적으로 차단되었습니다.");
        setFormData({ name: "", phone: "", email: "" }); // 입력창 초기화
        onClose(); // 모달 닫기
      } else if (response.data === "login_required") {
        alert("로그인이 필요합니다.");
      } else {
        alert("차단 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("차단 등록 에러:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    // 1. 배경 (검은색 반투명) - 클릭하면 닫히게 처리
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* 2. 모달 창 본문 */}
      <div
        className="bg-white w-[90%] max-w-md rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- 폼 시작 --- */}
        <div className="flex flex-col">
          {/* 이름 섹션 */}
          <div className="bg-gray-100 px-5 py-3 border-y border-gray-200">
            <h3 className="text-sm font-bold text-gray-700">이름 (선택)</h3>
          </div>
          <div className="px-5 py-4 bg-white">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="누군지 식별할 이름이나 별명을 입력하세요"
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
                name="phone" // ★ name 속성 추가
                value={formData.phone}
                onChange={handleChange}
                placeholder="전화번호 입력 (- 없이 숫자만 입력)"
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
                name="email" // ★ name 속성 추가
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full text-sm outline-none placeholder-gray-400 text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="p-5 bg-gray-50 border-t border-gray-200">
          <button
            className="w-full bg-[#ff4b6e] hover:bg-[#ff3b60] text-white font-bold py-3 rounded-lg transition-colors"
            onClick={handleSubmit} // ★ 클릭 시 전송 함수 실행
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockModal;
