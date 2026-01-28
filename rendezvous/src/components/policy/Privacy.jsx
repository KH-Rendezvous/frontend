import React from "react";
import HeaderComponent from "../home/HeaderComponent";
import FooterComponent from "../home/FooterComponent";

const Privacy = () => {
  const content = [
    {
      subtitle: "수집하는 개인정보 항목",
      text: "회사는 회원가입 및 서비스 제공을 위해 이메일, 이름, 생년월일, 성별, 선호 취항, 관심사, 본인 인증 정보 등을 수집합니다.",
    },
    {
      subtitle: "개인정보의 이용 목적",
      text: "수집된 정보는 맞춤형 매칭 알고리즘 적용, AI 연애 코칭 서비스 제공, 고객 상담 및 부정 이용 방지 목적으로만 사용됩니다.",
    },
    {
      subtitle: "개인정보의 보유 및 파기",
      text: "회원 탈퇴 시 사용자의 개인정보는 즉시 파기됩니다. 단, 부정 이용 기록이 있는 사용자의 경우 재가입 방지를 위해 6개월간 해당 기록을 보관할 수 있습니다.",
    },
    {
      subtitle: "정보 보호를 위한 노력",
      text: "랑데뷰는 모든 채팅 데이터와 개인정보를 암호화하여 저장하며, 법적 근거 없이 제3자에게 절대 제공하지 않습니다.",
    },
  ];

  return (
    <>
      <HeaderComponent />
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-8 pb-4 border-b border-gray-50 flex items-center gap-2">
            🔒 개인정보처리방침
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

export default Privacy;
