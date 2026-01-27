import React, { useState } from "react";
import DiscoverySidebar from "../components/discovery/DiscoverySidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [testRelIntent] = useState({ EMOJI: "🌹", CODE_NAME: "진지한 연애" });
  const [testInterests] = useState([
    { CODE_ID: 1, EMOJI: "✈️", CODE_NAME: "여행" },
    { CODE_ID: 2, EMOJI: "📺", CODE_NAME: "넷플릭스" },
  ]);
  return (
    <div className="flex w-full h-screen bg-white">
      {/* 1. 사이드바는 항상 왼쪽에 고정 */}
      <DiscoverySidebar
        myRelIntent={testRelIntent}
        topRelIntents={[
          testRelIntent,
          { EMOJI: "🥂", CODE_NAME: "가벼운 만남" },
        ]}
        myInterests={testInterests}
        topInterests={[{ CODE_ID: 3, EMOJI: "🏀", CODE_NAME: "운동" }]}
        // 필요한 props 전달 (예: 유저 정보 등)
      />

      {/* 2. 오른쪽 메인 영역 (URL에 따라 내용이 바뀜) */}
      <main className="flex-1 h-full overflow-y-auto bg-gray-50">
        <Outlet /> {/* 여기가 핵심! URL에 맞는 컴포넌트가 여기에 렌더링됨 */}
      </main>
    </div>
  );
};

export default MainLayout;
