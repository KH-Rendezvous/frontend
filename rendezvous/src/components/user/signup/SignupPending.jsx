import React from "react";
import { useNavigate } from "react-router-dom";

const SignupPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-20 p-4">
      {/* 1. 상단 로고 (카드 밖) */}
      <div className="mb-4 flex flex-col items-center animate-fade-in-down">
        <img
          src="/logo.png"
          alt="Rendezvous"
          className="h-32 object-contain drop-shadow-sm"
        />
      </div>

      {/* 2. 메인 카드 */}
      <div className="bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl p-10 text-center border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#EE4B6F]"></div>

        {/* 타이틀 영역 (양옆 라인 효과) */}
        <div className="relative mb-10 flex items-center justify-center">
          <div className="absolute w-full h-[1px] bg-gray-200"></div>
          <h2 className="relative z-10 bg-white px-6 text-2xl font-extrabold text-gray-800 tracking-tight">
            회원가입 승인 대기
          </h2>
        </div>

        {/* 아이콘 영역 (대기 중 느낌) */}
        <div className="w-24 h-24 bg-gradient-to-br from-[#EE4B6F]/10 to-[#FF6B6B]/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-[#EE4B6F]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* 메시지 영역 */}
        <div className="space-y-3 mb-10">
          <h3 className="text-xl font-bold text-gray-900">
            회원가입 신청이 완료 되었습니다.
          </h3>
          <div className="text-gray-500 text-sm leading-relaxed">
            <p>클린한 만남을 위해 꼼꼼히 확인하고 있어요.</p>
            <p className="mt-1">
              검토 후 가입 신청하신 이메일로
              <br />
              <span className="font-bold text-[#EE4B6F] underline decoration-[#EE4B6F]/30 underline-offset-4">
                24시간 이내에 승인 소식
              </span>
              을 보내드릴게요.
            </p>
          </div>
        </div>

        {/* 버튼 영역 */}
        <button
          onClick={() => navigate("/")}
          className="w-full py-4 bg-[#EE4B6F] hover:bg-[#D63A5C] text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          메인으로 이동
        </button>
      </div>
    </div>
  );
};

export default SignupPending;
