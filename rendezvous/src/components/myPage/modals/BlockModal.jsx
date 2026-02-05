import React, { useState } from "react";
// import axios from "axios"; // 안 쓰면 삭제
import { axiosApi } from "../../../api/axiosAPI";

// [수정 1] memberNo props 추가
const BlockModal = ({ isOpen, onClose, memberNo }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!memberNo) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    if (!formData.name && !formData.phone && !formData.email) {
      alert("차단할 사람의 정보를 하나라도 입력해주세요.");
      return;
    }

    if (!window.confirm("입력한 연락처를 차단하시겠습니까?")) return;

    try {
      const response = await axiosApi.post("/api/block/insert", {
        memberNo: memberNo,
        targetName: formData.name,
        targetPhone: formData.phone,
        targetEmail: formData.email,
      });

      if (
        response.data === 1 ||
        response.data === "success" ||
        response.data.result === "success"
      ) {
        alert("성공적으로 차단되었습니다.");
        setFormData({ name: "", phone: "", email: "" });
        onClose();
      } else {
        alert("차단 등록에 실패했습니다. (이미 차단되었거나 오류)");
      }
    } catch (error) {
      console.error("차단 등록 에러:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] max-w-md rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
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
                name="phone"
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
                name="email"
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
            onClick={handleSubmit}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockModal;
