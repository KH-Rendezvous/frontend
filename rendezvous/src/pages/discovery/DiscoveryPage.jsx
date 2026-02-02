import React, { useState } from "react";
import DiscoverySidebar from "../../components/discovery/DiscoverySidebar";
import DiscoveryMain from "../../components/discovery/DiscoveryMain";

const DiscoveryPage = () => {
  return (
    <div className="flex w-full h-screen bg-white">
      {/* 999를 3으로 수정하면 드디어 데이터가 나옵니다! */}
      <DiscoveryMain myMemberNo={3} />
    </div>
  );
};

export default DiscoveryPage;