import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QnaModal from "../myPage/modals/QnAModal";

const SideBar = () => {
  const [qnaStatus, setQnaStatus] = useState(false);
  const navigate = useNavigate();
  const supportMenus = [
    { label: "AI 매니저", path: "/ai-manager" },
    { label: "우리 어디서 만날까?", path: "/places" },
    { label: "QnA", path: null },
    { label: "마이페이지", path: "/myPage" },
    { label: "로그아웃", action: "logout" },
  ];

  const handleMenuClick = (item) => {
    if (item.action === "logout") {
      alert("로그아웃 되었습니다.");
      navigate("/signIn");
    } else if (item.label === "QnA") {
      setQnaStatus(true);
    } else if (item.path) {
      navigate(item.path);
    }
  };
  return (
    <>
      {qnaStatus && (
        <QnaModal isOpen={true} onClose={() => setQnaStatus(false)} />
      )}
      <aside className="w-[360px] h-screen bg-white border-r flex flex-col p-6 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col items-center mb-8">
          <div
            className="mb-12 px-1 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <img
              src="/logo.png"
              alt="Rendezvous Logo"
              className="h-[130px] w-auto object-contain hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="flex gap-2 w-full">
            <button className="flex-1 py-2 bg-[#FF4458] text-white rounded-full font-bold text-xs shadow-md">
              탐색
            </button>
            <button className="flex-1 py-2 text-gray-400 font-bold border rounded-full text-xs bg-white">
              매칭
            </button>
            <button className="flex-1 py-2 text-gray-400 font-bold border rounded-full text-xs bg-white relative">
              채팅{" "}
              <span className="absolute -top-1 -right-1 bg-[#FF4458] text-[9px] text-white w-4 h-4 flex items-center justify-center rounded-full">
                17
              </span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-gray-50 space-y-2">
          <p className="text-[10px] font-bold text-gray-300 mb-2 px-1 uppercase tracking-tighter italic">
            Support for you
          </p>
          {supportMenus.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className="w-full py-2.5 text-[11px] font-bold text-gray-500 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:text-[#FF4458] transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
