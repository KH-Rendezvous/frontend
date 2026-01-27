import React from "react";
import ProfileCard from "./ProfileCard"; // 분리한 카드 컴포넌트 import

const ProfilePreview = ({ data }) => {
  return (
    <div className="w-full flex justify-center items-start pt-4 pb-20">
      {/* 데이터만 쏙 넣어주면 끝 */}
      <ProfileCard userData={data} />
    </div>
  );
};

export default ProfilePreview;
