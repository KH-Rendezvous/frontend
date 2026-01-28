import React from "react";
import HeaderComponent from "../home/HeaderComponent";
import FooterComponent from "../home/FooterComponent";

const ServiceIntro = () => {
  const values = [
    {
      icon: "✨",
      title: "진심 어린 연결",
      desc: "단순한 스와이프를 넘어, 당신의 가치관과 라이프스타일을 심층 분석하여 매칭합니다.",
    },
    {
      icon: "🤖",
      title: "AI 연애 코칭",
      desc: "첫 대사가 고민인가요? 랑데뷰만의 전담 AI 코치가 실시간 대화 가이드를 제공합니다.",
    },
    {
      icon: "🛡️",
      title: "안전한 커뮤니티",
      desc: "24시간 모니터링과 철저한 본인 인증을 통해 믿을 수 있는 인연만을 연결합니다.",
    },
  ];

  return (
    <>
      <HeaderComponent />
      <div className="max-w-4xl mx-auto py-12 px-6 font-sans">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">
            우연이 운명이 되는 순간,{" "}
            <span className="text-[#ee4b6f]">랑데뷰</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            랑데뷰는 불어의 '만남'에서 유래했습니다. <br />
            우리는 가벼운 만남보다 서로의 가치가 빛나는 깊은 연결을 지향합니다.
          </p>
        </section>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">
                {v.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {v.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Special Feature Section */}
        <section className="mt-20 bg-[#fff0f3] rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 border border-pink-50">
          <div className="flex-1 text-center md:text-left">
            <span className="bg-[#ee4b6f] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Only Rendezvous
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-4">
              연애 고수 AI 매니저
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              프로필 분석부터 아이스브레이킹까지, 랑데뷰 AI가 당신의 든든한
              조력자가 되어드립니다. 대화가 끊길 걱정은 이제 그만하세요.
            </p>
          </div>
          <div className="w-32 h-32 bg-white rounded-[2rem] shadow-inner flex items-center justify-center text-5xl">
            🤖
          </div>
        </section>
      </div>
      <FooterComponent />
    </>
  );
};

export default ServiceIntro;
