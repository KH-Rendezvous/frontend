import React, { useState } from "react";
import DiscoverySidebar from "../../components/discovery/DiscoverySidebar";
import DiscoveryMain from "../../components/discovery/DiscoveryMain";

const DiscoveryPage = () => {
    // 임시 데이터 넣었음
    const [testRelIntent] = useState({ EMOJI: "🌹", CODE_NAME: "진지한 연애" });
    const [testInterests] = useState([
        { CODE_ID: 1, EMOJI: "✈️", CODE_NAME: "여행" },
        { CODE_ID: 2, EMOJI: "📺", CODE_NAME: "넷플릭스" }
    ]);

    return (
        <div className="flex w-full h-screen bg-white">
            <DiscoverySidebar
                myRelIntent={testRelIntent}
                topRelIntents={[testRelIntent, { EMOJI: "🥂", CODE_NAME: "가벼운 만남" }]}
                myInterests={testInterests}
                topInterests={[{ CODE_ID: 3, EMOJI: "🏀", CODE_NAME: "운동" }]}
            />
            <DiscoveryMain myMemberNo={999} />
        </div>
    );
};

export default DiscoveryPage;