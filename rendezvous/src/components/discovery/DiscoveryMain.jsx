import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import DiscoveryCard from "./DiscoveryCard";
import { axiosApi } from "../../api/axiosAPI";

const DiscoveryMain = ({ myMemberNo = 3 }) => {
  // [수정] 실제 DB 데이터를 담기 위해 초기값은 빈 배열로 설정
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // [추가] 백엔드에서 추천 유저 리스트를 가져오는 함수
    const fetchDiscoveryUsers = async () => {
      try {
        setLoading(true);
        // GET 방식으로 내 회원번호를 전달 (Controller의 @RequestParam과 매칭)
        const response = await axiosApi.get("/api/matching/discovery", {
          params: { memberNo: myMemberNo },
        });

        // 서버에서 가져온 데이터를 상태에 저장
        // DTO 필드명이 camelCase일 수 있으니 확인 (예: memberNo, photoUrl)
        setUsers(response.data);
      } catch (error) {
        console.error("인연 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    if (myMemberNo) {
      fetchDiscoveryUsers();
    }
  }, [myMemberNo]);

  const handleSwipe = (direction) => {
    if (users.length === 0) return;
    const actionType = direction === "right" ? "LIKE" : "NOPE";

    // [참고] users[0]의 필드명이 DB/DTO 설정에 따라 다를 수 있음
    // 만약 DTO에서 camelCase를 썼다면 users[0].nickname 으로 접근
    console.log(
      `Action: ${actionType} to ${users[0].nickname || users[0].NICKNAME}`,
    );

    // 다음 카드로 넘기기
    setUsers((prev) => prev.slice(1));

    // TODO: 나중에 이 시점에 DB에 ACTION을 저장하는 axios.post 코드가 들어올 자리입니다.
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
              // DTO 필드명에 맞춰 key값 설정 (memberNo 또는 MEMBER_NO)
              key={users[0].memberNo || users[0].MEMBER_NO}
              user={users[0]}
              onSwipe={handleSwipe}
            />
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <span className="text-6xl mb-6">🏜️</span>
          <p className="text-gray-400 font-black">
            더 이상 표시할 인연이 없어요.
          </p>
          <button className="mt-4 text-[#FF4458] font-bold underline">
            범위 넓혀보기
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscoveryMain;
