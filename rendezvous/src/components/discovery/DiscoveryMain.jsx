import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import DiscoveryCard from "./DiscoveryCard";

const DiscoveryMain = ({ myMemberNo }) => {
    // 임시 데이터 넣었음
    const [users, setUsers] = useState([
        { MEMBER_NO: 1, NICKNAME: "Anna", AGE: 25, CITY: "서울특별시", DISTANCE: 10, PHOTO_URL: "https://images.unsplash.com/photo-1517841905240-472988babdf9" },
        { MEMBER_NO: 2, NICKNAME: "James", AGE: 28, CITY: "경기도", DISTANCE: 15, PHOTO_URL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e" }
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        setLoading(false);
    }, []);

    const handleSwipe = (direction) => {
        if (users.length === 0) return;
        const actionType = direction === "right" ? "LIKE" : "NOPE";
        console.log(`Action: ${actionType} to ${users[0].NICKNAME}`);

        setUsers((prev) => prev.slice(1));
    };

    return (
        <div className="flex-1 bg-[#FDFCFB] flex items-center justify-center relative overflow-hidden">
            {loading ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-pink-500 font-bold">인연을 찾는 중...</p>
                </div>
            ) : users.length > 0 ? (
                <div className="relative w-[380px] h-[580px]">
                    <AnimatePresence mode="popLayout">
                        <DiscoveryCard
                            key={users[0].MEMBER_NO}
                            user={users[0]}
                            onSwipe={handleSwipe}
                        />
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-col items-center text-center">
                    <span className="text-6xl mb-6">🏜️</span>
                    <p className="text-gray-400 font-black">더 이상 표시할 인연이 없어요.</p>
                    <button className="mt-4 text-[#FF4458] font-bold underline">범위 넓혀보기</button>
                </div>
            )}
        </div>
    );
};

export default DiscoveryMain;