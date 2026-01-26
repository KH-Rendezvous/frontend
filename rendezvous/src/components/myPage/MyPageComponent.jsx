import React from "react";
import MyPageSidebar from "./MyPageSidebar";
import MyPageMain from "./MyPageMain";

const MyPageComponent = () => {
  return (
    <div className="flex bg-white min-h-screen">
      {/* 1. 왼쪽: 사이드바 (고정) */}
      <MyPageSidebar />

      {/* 2. 오른쪽: 메인 컨텐츠 (나머지 공간 다 차지) */}
      {/* flex-1: 남은 너비 꽉 채움 */}
      {/* h-screen + overflow-y-auto: 얘만 따로 스크롤 됨 */}
      <div className="flex-1 h-screen overflow-y-auto custom-scrollbar">
        <MyPageMain />
      </div>
    </div>
  );
};

export default MyPageComponent;
