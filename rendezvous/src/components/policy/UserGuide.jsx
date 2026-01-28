import React from "react";
import HeaderComponent from "../home/HeaderComponent";
import FooterComponent from "../home/FooterComponent";

const UserGuide = () => {
  const steps = [
    {
      num: "01",
      title: "프로필 완성",
      desc: "나를 보여주는 사진과 취향 태그를 꼼꼼히 입력해 주세요.",
    },
    {
      num: "02",
      title: "취향 탐색",
      desc: "탐색 탭에서 내 가치관과 꼭 맞는 상대를 찾아 하트를 보내세요.",
    },
    {
      num: "03",
      title: "매칭 & 채팅",
      desc: "서로 하트를 주고받으면 매칭 성공! 대화를 시작하세요.",
    },
    {
      num: "04",
      title: "AI 코치 활용",
      desc: "대화가 막힐 땐 AI 매니저 아이콘을 클릭해 조언을 구하세요.",
    },
  ];

  return (
    <>
      <HeaderComponent />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-black text-gray-900 mb-12 text-center italic tracking-tighter">
          How to <span className="text-[#ee4b6f]">Rendezvous</span>
        </h2>

        <div className="space-y-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-8 bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm hover:translate-x-2 transition-transform"
            >
              <span className="text-4xl font-black text-pink-100 italic">
                {s.num}
              </span>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-800 mb-1">
                  {s.title}
                </h4>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </div>
              <div className="w-10 h-10 bg-[#fff0f3] rounded-full flex items-center justify-center text-[#ee4b6f] shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default UserGuide;
