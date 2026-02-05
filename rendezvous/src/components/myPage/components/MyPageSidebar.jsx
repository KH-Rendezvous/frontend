import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
// import axios from "axios"; // 안 쓰면 삭제
import { axiosApi } from "../../../api/axiosAPI";

// 모달 컴포넌트들 임포트
import BlockModal from "../modals/BlockModal";
import BlockListModal from "../modals/BlockListModal";
import GenderModal from "../modals/GenderModal";
import QnaModal from "../modals/QnAModal";
import DeleteAccountModal from "../modals/DeleteAccountModal";

const MyPageSidebar = () => {
  const navigate = useNavigate();

  // [수정 1] 로컬스토리지에서 내 정보 꺼내기
  const [loginMember, setLoginMember] = useState(() => {
    const stored = localStorage.getItem("loginMember");
    return stored ? JSON.parse(stored) : null;
  });

  // 로그인 안 됐으면 0 (또는 튕겨내기)
  const memberNo = loginMember ? loginMember.memberNo : 0;

  // 상태 초기값 (DB에서 불러오기 전까지는 기본값)
  const [distance, setDistance] = useState(100);
  const [ageRange, setAgeRange] = useState([19, 50]);
  const [gender, setGender] = useState("여성"); // 이건 DB 값 보고 '남성'/'여성' 세팅
  const [visibility, setVisibility] = useState("A");

  // 모달 상태들
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockListModalOpen, setIsBlockListModalOpen] = useState(false);
  const [isQnaModalOpen, setIsQnaModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);

  // [수정 2] 페이지 로드 시 DB에 저장된 내 설정값 가져오기
  useEffect(() => {
    if (!memberNo) return;

    const fetchMySettings = async () => {
      try {
        // 기존에 만든 프로필 조회 API 활용 (여기에 설정값도 다 들어있음)
        const response = await axiosApi.get("/api/mypage/profile", {
          params: { memberNo: memberNo },
        });

        if (response.data.result === "success") {
          const data = response.data.data;

          // 1. 거리 설정 (null이면 100으로 간주)
          setDistance(data.searchDistance || 100);

          // 2. 나이 설정
          const minAge = data.targetMinAge || 19;
          const maxAge = data.targetMaxAge || 50;
          setAgeRange([minAge, maxAge]);

          // 3. 공개 범위 (A: 전체, P: 비공개)
          setVisibility(data.profileOpen || "A");

          // 4. 보고 싶은 성별 (M: 남성, F: 여성) - 화면 표시용 한글 변환
          if (data.targetGender === "M") setGender("남성");
          else if (data.targetGender === "F") setGender("여성");
          else setGender("모든 성별"); // 혹시 A가 있다면
        }
      } catch (error) {
        console.error("설정 정보 로딩 실패:", error);
      }
    };

    fetchMySettings();
  }, [memberNo]);

  // --- 거리 관련 핸들러 ---
  const handleDistanceChange = (value) => {
    setDistance(value);
  };

  const handleDistanceAfterChange = async (value) => {
    if (!memberNo) return; // 로그인 안 했으면 중단

    const payloadDistance = value === 100 ? null : value;
    console.log("DB로 전송할 거리:", payloadDistance);

    try {
      const response = await axiosApi.put("/api/mypage/distance", {
        memberNo: memberNo,
        searchDistance: payloadDistance,
      });

      if (response.data.result === "success") {
        console.log("✅ 거리 설정 저장 완료!");
      } else {
        alert("저장 실패");
      }
    } catch (error) {
      console.error("❌ 에러 발생:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  // --- 연령대 관련 핸들러 ---
  const handleAgeChange = (value) => {
    setAgeRange(value);
  };

  const handleAgeAfterChange = async (value) => {
    if (!memberNo) return;

    const minAge = value[0];
    let maxAge = value[1];
    const payloadMaxAge = maxAge === 50 ? null : maxAge;

    try {
      const response = await axiosApi.put("/api/mypage/age", {
        memberNo: memberNo,
        targetMinAge: minAge,
        targetMaxAge: payloadMaxAge,
      });

      if (response.data.result === "success") {
        console.log("✅ 연령대 설정 저장 완료!");
      } else {
        alert("연령대 저장 실패");
      }
    } catch (error) {
      console.error("❌ 연령대 저장 에러:", error);
    }
  };

  // --- 성별 변경 핸들러 ---
  const handleGenderSave = async (newGenderKor) => {
    if (!memberNo) return;

    let code = "A"; // 기본값
    if (newGenderKor === "남성") code = "M";
    else if (newGenderKor === "여성") code = "F";

    try {
      const response = await axiosApi.put("/api/mypage/gender", {
        memberNo: memberNo,
        targetGender: code,
      });

      if (response.data.result === "success") {
        setGender(newGenderKor);
      }
    } catch (error) {
      console.error("❌ 성별 변경 에러:", error);
    }
  };

  // --- 공개범위 핸들러 ---
  const handleVisibilityChange = async (e) => {
    if (!memberNo) return;

    const newCode = e.target.value; // 'A' or 'P'
    const oldCode = visibility;

    setVisibility(newCode);

    try {
      const response = await axiosApi.put("/api/mypage/visibility", {
        memberNo: memberNo,
        profileOpen: newCode,
      });

      if (response.data.result !== "success") {
        alert("저장 실패");
        setVisibility(oldCode);
      }
    } catch (error) {
      console.error("❌ 공개범위 저장 에러:", error);
      setVisibility(oldCode);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("로그아웃 하시겠습니까?")) return;

    try {
      // 1. 서버 세션 날리기
      await axiosApi.get("/api/member/logout");

      // 2. 클라이언트 정리
      localStorage.removeItem("loginMember");
      localStorage.removeItem("accessToken");

      // 3. 이벤트 발송 (헤더 상태 변경용)
      window.dispatchEvent(new Event("loginStateChange"));

      alert("로그아웃 되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패", error);
      localStorage.removeItem("loginMember");
      window.dispatchEvent(new Event("loginStateChange"));
      navigate("/");
    }
  };

  return (
    <aside className="w-[360px] h-screen bg-[#FDFCFB] border-r border-gray-200 flex flex-col font-sans sticky top-0 left-0 z-50">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 10px; border:3px solid transparent; background-clip: padding-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #c9c9c9; }
      `}</style>

      {/* 1. 헤더 & 탭 */}
      <div className="p-6 pb-0">
        <img
          src="/logo.png"
          alt="Rendezvous"
          onClick={() => navigate("/")}
          className="h-40 mx-auto mb-6 object-contain cursor-pointer transition-transform hover:scale-105"
        />
        <div className="flex justify-between bg-white border border-gray-200 rounded-[20px] p-1 shadow-sm mb-6">
          <button
            onClick={() => navigate("/discovery")}
            className="flex-1 py-2.5 text-sm font-bold text-black hover:bg-gray-50 hover:text-black rounded-[15px] transition-all"
          >
            탐색
          </button>
          <button className="flex-1 py-2.5 text-sm font-bold text-black hover:bg-gray-50 hover:text-black rounded-[15px] transition-all">
            매칭
          </button>
          <button className="flex-1 py-2.5 text-sm font-bold text-black hover:bg-gray-50 hover:text-black rounded-[15px] relative transition-all">
            채팅{" "}
            <span className="absolute -top-1 -right-1 bg-[#EE4B6F] text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white shadow-sm">
              17
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto custom-scrollbar">
        {/* 2. 소셜 디스커버리 범위 설정 */}
        <div className="mb-8">
          <h3 className="text-[15px] font-bold text-gray-800 mb-2 border-b border-gray-800 pb-3">
            소셜 디스커버리 범위 설정
          </h3>

          {/* 거리 설정 */}
          <div className="py-5 px-1 border-b border-gray-100">
            <div className="flex justify-between mb-4 text-sm font-medium">
              <span className="text-black">상대와의 거리</span>
              <span className="text-sm text-gray-800 font-bold">
                {distance === 100 ? "제한 없음" : `${distance}km`}
              </span>
            </div>
            <div className="px-2">
              <Slider
                min={1}
                max={100}
                value={distance}
                onChange={handleDistanceChange}
                onChangeComplete={handleDistanceAfterChange}
                styles={{
                  track: { backgroundColor: "#EE4B6F", height: 4 },
                  handle: {
                    borderColor: "#EE4B6F",
                    backgroundColor: "#EE4B6F",
                    opacity: 1,
                    boxShadow: "none",
                    height: 14,
                    width: 14,
                    marginTop: -5,
                  },
                  rail: { backgroundColor: "#e5e7eb", height: 4 },
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1km</span>
                <span>제한 없음</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => setIsGenderModalOpen(true)}
            className="flex justify-between items-center py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group px-1"
          >
            <span className="text-sm font-medium text-black group-hover:text-gray-900">
              보고 싶은 성별
            </span>
            <span className="text-sm text-gray-500 group-hover:text-gray-800 font-bold">
              {gender} {">"}
            </span>
          </div>

          {/* 연령대 설정 */}
          <div className="py-5 px-1 border-b border-gray-100">
            <div className="flex justify-between mb-4 text-sm font-medium">
              <span className="text-black">상대의 연령대</span>
              <span className="text-sm text-gray-800 font-bold">
                {ageRange[0] === 19 && ageRange[1] === 50
                  ? "제한 없음"
                  : `${ageRange[0]} - ${ageRange[1] === 50 ? "제한 없음" : ageRange[1]}`}
              </span>
            </div>

            <div className="px-2">
              <Slider
                range
                min={19}
                max={50}
                value={ageRange}
                onChange={handleAgeChange}
                onChangeComplete={handleAgeAfterChange}
                styles={{
                  track: { backgroundColor: "#EE4B6F", height: 4 },
                  handle: {
                    borderColor: "#EE4B6F",
                    backgroundColor: "#EE4B6F",
                    opacity: 1,
                    boxShadow: "none",
                    height: 14,
                    width: 14,
                    marginTop: -5,
                  },
                  rail: { backgroundColor: "#e5e7eb", height: 4 },
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>19세</span>
                <span>제한 없음</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 프로필 공개 설정 */}
        <div className="mb-8">
          <h3 className="text-[15px] font-bold text-gray-800 mb-2 border-b border-gray-800 pb-3">
            프로필 공개 설정
          </h3>
          <label className="flex justify-between items-center py-4 cursor-pointer hover:bg-gray-50 transition-colors px-1 border-b border-gray-100">
            <div>
              <div className="text-sm font-bold text-gray-700 mb-1">
                모든 상대
              </div>
              <div className="text-xs text-gray-500">
                내 프로필이 모든 상대에게 표시됩니다.
              </div>
            </div>
            <input
              type="radio"
              name="visibility"
              value="A"
              checked={visibility === "A"}
              onChange={handleVisibilityChange}
              className="w-5 h-5 accent-[#EE4B6F] cursor-pointer"
            />
          </label>
          <label className="flex justify-between items-center py-4 cursor-pointer hover:bg-gray-50 transition-colors px-1 border-b border-gray-100">
            <div>
              <div className="text-sm font-bold text-gray-700 mb-1">
                비공개 모드
              </div>
              <div className="text-xs text-gray-500">
                내가 LIKE한 사람만 볼 수 있습니다.
              </div>
            </div>
            <input
              type="radio"
              name="visibility"
              value="P"
              checked={visibility === "P"}
              onChange={handleVisibilityChange}
              className="w-5 h-5 accent-[#EE4B6F] cursor-pointer"
            />
          </label>
        </div>

        {/* 4. 차단 설정 & 하단 버튼들 */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold text-gray-800 mb-2 border-b border-gray-800 pb-3">
            차단 설정
          </h3>
          <div
            onClick={() => setIsModalOpen(true)}
            className="flex justify-between items-center py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors px-1"
          >
            <span className="text-sm font-medium text-black">연락처 차단</span>
            <span className="text-gray-400">{">"}</span>
          </div>
          <div
            onClick={() => setIsBlockListModalOpen(true)}
            className="flex justify-between items-center py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors px-1"
          >
            <span className="text-sm font-medium text-black">차단 관리</span>
            <span className="text-gray-400">{">"}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2 mb-4 leading-relaxed px-1">
            Rendezvous에서 보고 싶지 않거나 내 프로필을 보이고 싶지 않은 사람이
            있다면 선택해 주세요.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setIsQnaModalOpen(true)}
            className="w-full py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          >
            QnA
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          >
            로그아웃
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-red-500 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          >
            회원탈퇴
          </button>
        </div>
      </div>

      {/* 모달 컴포넌트들 (memberNo prop 전달) */}
      <BlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memberNo={memberNo}
      />
      <BlockListModal
        isOpen={isBlockListModalOpen}
        onClose={() => setIsBlockListModalOpen(false)}
        memberNo={memberNo}
      />
      <GenderModal
        isOpen={isGenderModalOpen}
        onClose={() => setIsGenderModalOpen(false)}
        currentGender={gender}
        memberNo={memberNo}
        onSave={(newGender) => setGender(newGender)}
      />
      <QnaModal
        isOpen={isQnaModalOpen}
        onClose={() => setIsQnaModalOpen(false)}
        memberNo={memberNo}
      />
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        memberNo={memberNo}
      />
    </aside>
  );
};

export default MyPageSidebar;
