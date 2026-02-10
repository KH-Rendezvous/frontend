import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosApi } from "../../../api/axiosAPI";

const FindPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 정보확인, 2:비번재설정, 3:완료

  // 1단계: 본인 확인용 데이터
  const [authData, setAuthData] = useState({
    email: "",
    name: "",
    birth: "",
    phone: "",
  });

  // 2단계: 비밀번호 변경용 데이터
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // 입력 핸들러 (1단계)
  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthData((prev) => ({ ...prev, [name]: value }));
  };

  // 입력 핸들러 (2단계)
  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // 1단계 제출: 회원 정보 확인
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      // API 호출: 정보 일치 여부 확인
      const response = await axiosApi.post("/api/member/check-info", authData);

      if (response.data === true) {
        setStep(2); // 다음 단계로 이동
      } else {
        alert("일치하는 회원 정보가 없습니다.");
      }
    } catch (error) {
      console.error("정보 확인 에러:", error);
      alert("회원 정보를 찾을 수 없습니다.");
    }
  };

  // 2단계 제출: 비밀번호 변경
  const handlePwSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // API 호출: 비밀번호 변경 (이메일 + 새비번 전송)
      const payload = {
        email: authData.email,
        password: passwordData.newPassword,
      };

      const response = await axiosApi.post(
        "/api/member/reset-password",
        payload,
      );

      if (response.data > 0) {
        setStep(3); // 완료 화면으로
      } else {
        alert("비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 에러:", error);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-12 p-4 font-sans">
      {/* 상단 로고 */}
      <div className="mb-8 flex flex-col items-center animate-fade-in-down">
        <Link to="/">
          <img
            src="/logo.png"
            alt="Rendezvous"
            className="h-32 object-contain mb-2 drop-shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </Link>
      </div>

      <div className="bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl p-10 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#EE4B6F]"></div>

        <div className="text-center mb-8 mt-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 1 && "비밀번호 찾기"}
            {step === 2 && "비밀번호 재설정"}
            {step === 3 && "변경 완료"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {step === 1 && "가입된 회원 정보를 입력해주세요."}
            {step === 2 && "새로운 비밀번호를 입력해주세요."}
            {step === 3 && "성공적으로 변경되었습니다."}
          </p>
        </div>

        {/* --- STEP 1: 정보 확인 --- */}
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleAuthSubmit}>
            <label
              htmlFor="name"
              className="text-sm font-bold text-gray-800 ml-1"
            >
              이메일
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="이메일"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20"
              value={authData.email}
              onChange={handleAuthChange}
            />

            <label
              htmlFor="name"
              className="text-sm font-bold text-gray-800 ml-1"
            >
              이름
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="이름"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20"
              value={authData.name}
              onChange={handleAuthChange}
            />
            <label
              htmlFor="name"
              className="text-sm font-bold text-gray-800 ml-1"
            >
              생년월일
            </label>
            <input
              name="birth"
              type="text"
              required
              placeholder="YYYYMMDD (예: 19990101)"
              maxLength={8}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20"
              value={authData.birth}
              onChange={(e) =>
                setAuthData({
                  ...authData,
                  birth: e.target.value.replace(/[^0-9]/g, ""),
                })
              }
            />
            <label
              htmlFor="name"
              className="text-sm font-bold text-gray-800 ml-1"
            >
              휴대폰 번호
            </label>
            <input
              name="phone"
              type="tel"
              required
              placeholder="(-) 없이 숫자만 입력"
              maxLength={11}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20"
              value={authData.phone}
              onChange={(e) =>
                setAuthData({
                  ...authData,
                  phone: e.target.value.replace(/[^0-9]/g, ""),
                })
              }
            />

            <button
              type="submit"
              className="w-full py-4 bg-[#EE4B6F] hover:bg-[#D63A5C] text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 transition-all mt-4"
            >
              확인
            </button>
          </form>
        )}

        {/* --- STEP 2: 비밀번호 재설정 --- */}
        {step === 2 && (
          <form className="space-y-4" onSubmit={handlePwSubmit}>
            <input
              name="newPassword"
              type="password"
              required
              placeholder="새 비밀번호"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20"
              value={passwordData.newPassword}
              onChange={handlePwChange}
            />
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="새 비밀번호 확인"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20"
              value={passwordData.confirmPassword}
              onChange={handlePwChange}
            />

            <button
              type="submit"
              className="w-full py-4 bg-[#EE4B6F] hover:bg-[#D63A5C] text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 transition-all mt-4"
            >
              변경하기
            </button>
          </form>
        )}

        {/* --- STEP 3: 완료 --- */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center">
              <p className="text-gray-600">
                이제 새로운 비밀번호로
                <br />
                로그인할 수 있습니다.
              </p>
            </div>
            <button
              onClick={() => navigate("/signIn")}
              className="w-full py-4 bg-[#EE4B6F] hover:bg-[#D63A5C] text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 transition-all"
            >
              로그인 하러 가기
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="mt-8 text-center flex justify-center gap-4 text-sm text-gray-400">
            <Link
              to="/find-email"
              className="hover:text-[#EE4B6F] hover:underline transition-colors"
            >
              이메일 찾기
            </Link>
            <span>|</span>
            <Link
              to="/signup"
              className="hover:text-[#EE4B6F] hover:underline transition-colors"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPassword;
