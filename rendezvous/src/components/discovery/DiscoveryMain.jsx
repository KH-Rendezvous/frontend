import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import DiscoveryCard from "./DiscoveryCard";
import { axiosApi } from "../../api/axiosAPI";

const DiscoveryMain = ({ loginMember }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 데이터 확인 로그
    console.log("📍 [DiscoveryMain] 현재 로그인 정보:", loginMember);

    const fetchDiscoveryUsers = async () => {
      if (!loginMember || !loginMember.memberNo) {
        console.warn("⚠️ 로그인 정보가 없어 리스트를 불러올 수 없습니다.");
        return;
      }

      try {
        setLoading(true);

        // 2. 서버 로그의 null을 해결하기 위해 위도/경도를 명시적으로 포함
        const params = {
          memberNo: loginMember.memberNo,
          gender: loginMember.targetGender,
          distance: loginMember.targetDistance || 100,
          minAge: loginMember.minAge || 19,
          maxAge: loginMember.maxAge || 99,
          latitude: loginMember.latitude,
          longitude: loginMember.longitude,
        };

        console.log("🚀 서버로 보낼 실제 파라미터:", params);

        const response = await axiosApi.get("/api/matching/discovery", {
          params,
        });

        console.log("✅ 서버 응답 결과(Total):", response.data?.length || 0);
        setUsers(response.data || []);
      } catch (error) {
        console.error("❌ 탐색 리스트 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscoveryUsers();
  }, [loginMember]);

  const handleSwipe = async (direction, targetMemberNo) => {
    if (users.length === 0) return;

    // 📍 이름을 'actionType'으로 맞춰줍니다 (DB 컬럼명과 매칭되도록)
    const actionType = direction === "right" ? "LIKE" : "NOPE";

    setUsers((prev) => prev.slice(1));

    try {
      await axiosApi.post("/api/matching/action", {
        senderNo: loginMember.memberNo,
        receiverNo: targetMemberNo,
        actionType: actionType, // 📍 action 대신 actionType으로 변경!
        inputType: "SWIPE", // 📍 로그 보니 inputType도 필요해 보여서 추가함
      });
      console.log("✅ 액션 저장 성공");
    } catch (error) {
      console.error("❌ 액션 저장 실패:", error);
    }
  };

  return (
    <div className="flex-1 bg-[#FDFCFB] flex items-center justify-center relative overflow-hidden">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-pink-500 font-bold italic">
            주변의 인연을 불러오는 중...
          </p>
        </div>
      ) : users.length > 0 ? (
        <div className="relative w-[380px] h-[580px]">
          <AnimatePresence mode="popLayout">
            <DiscoveryCard
              // DB 결과가 대문자(MEMBER_NO)로 넘어올 경우를 대비한 방어 코드
              key={users[0].MEMBER_NO || users[0].memberNo}
              user={users[0]}
              onSwipe={handleSwipe}
            />
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center px-6">
          <span className="text-6xl mb-6">🏜️</span>
          <p className="text-gray-400 font-black italic">
            주변에 조건에 맞는 인연이 없어요.
          </p>
          <p className="text-[10px] text-gray-300 mt-2">
            마이페이지에서 탐색 거리나 성별 설정을 확인해 보세요!
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscoveryMain;
