import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosApi } from "../../../api/axiosAPI";

const LoginPage = () => {
  const navigate = useNavigate();

  // 입력값 상태 관리
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 체크박스 상태 관리
  const [isChecked, setIsChecked] = useState({
    autoLogin: false, // 자동 로그인
    saveEmail: false, // 이메일 저장
  });

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 체크박스 핸들러
  const handleCheck = (e) => {
    const { name, checked } = e.target;
    setIsChecked((prev) => ({ ...prev, [name]: checked }));
  };

  // 로그인 요청 핸들러
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axiosApi.post("/api/member/login", formData);

      console.log("서버 응답:", response.data);

      if (response.data.result === 1) {
        const member = response.data.member;

        localStorage.setItem("loginMember", JSON.stringify(member));

        window.dispatchEvent(new Event("loginStateChange"));

        alert("로그인 성공!");
        navigate("/");
      } else {
        alert("이메일 또는 비밀번호가 잘못 입력되었습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("로그인 중 에러 발생");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-24 p-4">
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

      {/* 메인 카드 */}
      <div className="bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl p-10 border border-gray-100 relative overflow-hidden">
        {/* 상단 장식용 바 */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#EE4B6F]"></div>

        <form onSubmit={handleLogin} className="space-y-6 mt-2">
          {/* 이메일 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 ml-1">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 ml-1">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20 transition-all placeholder:text-gray-400 font-sans"
            />
          </div>

          {/* 체크박스 & 링크 모음 */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4">
              {/* 자동 로그인 */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isChecked.autoLogin ? "bg-[#EE4B6F] border-[#EE4B6F]" : "border-gray-300 bg-white group-hover:border-[#EE4B6F]"}`}
                >
                  {isChecked.autoLogin && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  name="autoLogin"
                  className="hidden"
                  checked={isChecked.autoLogin}
                  onChange={handleCheck}
                />
                <span className="text-xs text-gray-600 font-medium group-hover:text-[#EE4B6F] transition-colors">
                  자동 로그인
                </span>
              </label>

              {/* 이메일 저장 */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isChecked.saveEmail ? "bg-[#EE4B6F] border-[#EE4B6F]" : "border-gray-300 bg-white group-hover:border-[#EE4B6F]"}`}
                >
                  {isChecked.saveEmail && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  name="saveEmail"
                  className="hidden"
                  checked={isChecked.saveEmail}
                  onChange={handleCheck}
                />
                <span className="text-xs text-gray-600 font-medium group-hover:text-[#EE4B6F] transition-colors">
                  이메일 저장
                </span>
              </label>
            </div>

            {/* 찾기 링크 */}
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <Link
                to="/find-email"
                className="hover:text-[#EE4B6F] hover:underline transition-colors"
              >
                이메일 찾기
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/find-password"
                className="hover:text-[#EE4B6F] hover:underline transition-colors"
              >
                비밀번호 찾기
              </Link>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full py-4 bg-[#EE4B6F] hover:bg-[#D63A5C] text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 mt-4"
          >
            로그인
          </button>
        </form>

        {/* 회원가입 링크 (하단 추가) */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            아직 회원이 아니신가요?
            <Link
              to="/signup"
              className="text-[#EE4B6F] font-bold ml-2 hover:underline decoration-2 underline-offset-4"
            >
              회원가입 하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
