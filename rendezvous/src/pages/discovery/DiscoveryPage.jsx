import React, { useState, useEffect } from "react";
import DiscoveryMain from "../../components/discovery/DiscoveryMain";

const DiscoveryPage = () => {
  const [loginMember, setLoginMember] = useState(null);

  useEffect(() => {
    // 📍 LoginPage에서 저장한 'localStorage'에서 데이터를 꺼내옵니다!
    const savedUser = localStorage.getItem("loginMember");
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log("✅ [DiscoveryPage] 로컬스토리지에서 로그인 정보 로드:", parsedUser.nickname);
        setLoginMember(parsedUser);
      } catch (e) {
        console.error("❌ 데이터 파싱 에러:", e);
      }
    } else {
      console.error("❌ 로컬스토리지에 'loginMember'가 없습니다. 로그인을 다시 해주세요.");
    }
  }, []);

  return (
    <div className="flex-1 bg-white h-full overflow-hidden">
      {/* 이제 실제 로그인한 유저 정보가 들어갑니다. */}
      {loginMember ? (
        <DiscoveryMain loginMember={loginMember} />
      ) : (
        <div className="h-full flex items-center justify-center flex-col gap-4">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold">인연을 찾는 중...</p>
        </div>
      )}
    </div>
  );
};

export default DiscoveryPage;