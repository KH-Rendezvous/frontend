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
            </div>
          ))}
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default UserGuide;
