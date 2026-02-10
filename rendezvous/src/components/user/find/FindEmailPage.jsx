import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosApi } from "../../../api/axiosAPI";

const FindEmail = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("input");
  const [formData, setFormData] = useState({
    name: "",
    birth: "",
    phone: "",
  });
  const [foundEmail, setFoundEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사: 빈 값 체크
    if (!formData.name || !formData.birth || !formData.phone) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    try {
      // 1. 실제 API 호출
      const response = await axiosApi.post("/api/member/find-email", formData);

      // 2. 성공 처리 (200 OK)
      if (response.status === 200 && response.data.email) {
        setFoundEmail(response.data.email);
        setStep("result");
      }
    } catch (error) {
      console.error("이메일 찾기 에러:", error);

      // 3. 에러 처리
      if (error.response && error.response.status === 404) {
        // 백엔드에서 못 찾았을 때 (HttpStatus.NOT_FOUND)
        alert("일치하는 회원 정보가 없습니다.");
      } else {
        // 그 외 서버 에러 등
        alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-12 p-4 font-sans">
      {/* 상단 로고 (로그인 페이지와 동일) */}
      <div className="mb-8 flex flex-col items-center animate-fade-in-down">
        <Link to="/">
          <img
            src="/logo.png"
            alt="Rendezvous"
            className="h-32 object-contain mb-2 drop-shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </Link>
      </div>

      {/* 메인 카드 */}
      <div className="bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl p-10 border border-gray-100 relative overflow-hidden">
        {/* 상단 장식용 바 */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#EE4B6F]"></div>

        <div className="text-center mb-8 mt-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {step === "input" ? "이메일 찾기" : "이메일 찾기 성공"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {step === "input"
              ? "가입 시 등록한 정보를 입력해주세요."
              : "회원님의 정보와 일치하는 이메일입니다."}
          </p>
        </div>

        {step === "input" ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 이름 입력 */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-bold text-gray-800 ml-1"
              >
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="실명을 입력해주세요"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20 transition-all placeholder:text-gray-400"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* 생년월일 입력 */}
            <div className="space-y-2">
              <label
                htmlFor="birth"
                className="text-sm font-bold text-gray-800 ml-1"
              >
                생년월일
              </label>
              <input
                id="birth"
                name="birth"
                type="text"
                required
                placeholder="YYYYMMDD (예: 19990101)"
                maxLength={8}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20 transition-all placeholder:text-gray-400"
                value={formData.birth}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setFormData((prev) => ({ ...prev, birth: val }));
                }}
              />
            </div>

            {/* 전화번호 입력 */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-bold text-gray-800 ml-1"
              >
                휴대폰 번호
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="(-) 없이 숫자만 입력"
                maxLength={11}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20 transition-all placeholder:text-gray-400"
                value={formData.phone}
                onChange={handlePhoneChange}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#EE4B6F] hover:bg-[#D63A5C] text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 mt-6"
            >
              이메일 찾기
            </button>
          </form>
        ) : (
          // 결과 화면
          <div className="space-y-8 animate-fade-in-up">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center shadow-inner">
              <p className="text-sm text-gray-500 mb-3 font-medium">
                등록된 이메일
              </p>
              <p className="text-xl font-bold text-[#EE4B6F] break-all select-all">
                {foundEmail}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/signIn")}
                className="w-full py-4 bg-[#EE4B6F] hover:bg-[#D63A5C] text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                로그인 하러 가기
              </button>
              <button
                onClick={() => {
                  setStep("input");
                  setFormData({ name: "", birth: "", phone: "" });
                }}
                className="w-full py-4 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl font-bold text-lg transition-all duration-300"
              >
                다시 찾기
              </button>
            </div>
          </div>
        )}

        {/* 하단 링크 영역 */}
        <div className="mt-8 text-center flex justify-center gap-4 text-sm text-gray-400">
          <Link
            to="/find-password"
            className="hover:text-[#EE4B6F] hover:underline transition-colors"
          >
            비밀번호 찾기
          </Link>
          <span>|</span>
          <Link
            to="/signup"
            className="hover:text-[#EE4B6F] hover:underline transition-colors"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FindEmail;
