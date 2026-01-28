import React from "react";
import HeaderComponent from "../home/HeaderComponent";
import FooterComponent from "../home/FooterComponent";

const Terms = () => {
  const content = [
    {
      subtitle: "제1조 (목적)",
      text: "본 약관은 '랑데뷰(Rendezvous)'(이하 '서비스')가 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와 회사의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.",
    },
    {
      subtitle: "제2조 (회원 가입 및 자격)",
      text: "본 서비스는 만 19세 이상의 성인만 이용 가능합니다. 타인의 정보를 도용하여 가입하거나 허위 정보를 기재할 경우 서비스 이용이 영구 제한될 수 있습니다.",
    },
    {
      subtitle: "제3조 (서비스 이용 및 예절)",
      text: "랑데뷰는 건강한 만남을 지향합니다. 상대방에게 불쾌감을 주는 행위(비방, 욕설, 음란물 전송 등)나 상업적 광고, 금전 요구 행위는 즉시 제재 대상이 됩니다.",
    },
    {
      subtitle: "제4조 (면책 조항)",
      text: "회사는 이용자 간의 매칭 플랫폼을 제공할 뿐, 이용자 간에 발생하는 실제 만남 및 대화 내용에 대한 법적 책임은 이용자 본인에게 있습니다.",
    },
  ];

  return (
    <>
      <HeaderComponent />
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-8 pb-4 border-b border-gray-50 flex items-center gap-2">
            📜 이용약관
          </h2>
          <div className="space-y-10">
            {content.map((item, idx) => (
              <div key={idx}>
                <h3 className="text-[15px] font-bold text-[#ee4b6f] mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#ee4b6f] rounded-full"></span>
                  {item.subtitle}
                </h3>
                <p className="text-sm text-gray-500 leading-[1.8] whitespace-pre-wrap pl-3">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default Terms;
