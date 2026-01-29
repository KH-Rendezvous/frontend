import React, { useState, useEffect } from "react";
import DiscoverySidebar from "../components/discovery/DiscoverySidebar";
import { Outlet } from "react-router-dom";
import { MATCH_DATA } from "../utils/matchData"; 

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("received");

  // 임시데이터 설정.
  
  // 1. 내가 선택한 관계 (메인 1개)
  const [myRelIntent, setMyRelIntent] = useState({ 
    EMOJI: "🌹", 
    CODE_NAME: "진지한 연애" 
  });

  // 2. 회원들이 많이 선택한 관계
  const [topRelIntents, setTopRelIntents] = useState([
    { EMOJI: "🥂", CODE_NAME: "가벼운 만남" },
    { EMOJI: "🙌", CODE_NAME: "같이 취미 즐길 동네 친구" },
    { EMOJI: "🎬", CODE_NAME: "영화 메이트" } 
  ]);

  // 3. 내가 정한 관심사나 취미
  const [myInterests, setMyInterests] = useState([
    { CODE_ID: 1, EMOJI: "✈️", CODE_NAME: "여행" },
    { CODE_ID: 2, EMOJI: "📺", CODE_NAME: "넷플릭스" },
    { CODE_ID: 3, EMOJI: "🐶", CODE_NAME: "반려동물" },
    { CODE_ID: 4, EMOJI: "🏀", CODE_NAME: "스포츠" },
    { CODE_ID: 5, EMOJI: "🧗", CODE_NAME: "클라이밍" },
    { CODE_ID: 6, EMOJI: "🕹️", CODE_NAME: "게임" }
  ]);

  // 4. 회원들이 많이 설정한 인기 관심사 키워드
  const [topInterests, setTopInterests] = useState([
    { CODE_ID: 10, EMOJI: "😋", CODE_NAME: "맛집" },
    { CODE_ID: 11, EMOJI: "☕", CODE_NAME: "카페" },
    { CODE_ID: 12, EMOJI: "📸", CODE_NAME: "사진" },
    { CODE_ID: 13, EMOJI: "🍀", CODE_NAME: "산책" }
  ]);

  return (
    <div className="flex w-full h-screen bg-white overflow-hidden">
      {/* 1. 사이드바 영역: 모든 데이터와 탭 제어 함수를 넘김 */}
      <DiscoverySidebar
        myRelIntent={myRelIntent} 
        topRelIntents={topRelIntents}
        myInterests={myInterests}
        topInterests={topInterests}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        matchData={MATCH_DATA} 
      />

      {/* 2. 메인 컨텐츠 */}
      <main className="flex-1 h-full overflow-y-auto bg-gray-50 custom-scrollbar">
        {/* Outlet의 context를 통해 하위 페이지에 공통 데이터 전달 */}
        <Outlet context={{ activeTab, matchData: MATCH_DATA }} />
      </main>
    </div>
  );
};

export default MainLayout;