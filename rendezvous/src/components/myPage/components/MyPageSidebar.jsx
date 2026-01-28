import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import axios from "axios";

// 모달 컴포넌트들 임포트
import BlockModal from "../modals/BlockModal";
import BlockListModal from "../modals/BlockListModal";
import GenderModal from "../modals/GenderModal";
import QnaModal from "../modals/QnAModal";
import DeleteAccountModal from "../modals/DeleteAccountModal";

const MyPageSidebar = () => {
  const navigate = useNavigate();

  const memberNo = 1;

  const [distance, setDistance] = useState(10);

  const [ageRange, setAgeRange] = useState([19, 39]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isBlockListModalOpen, setIsBlockListModalOpen] = useState(false);

  const [isQnaModalOpen, setIsQnaModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);

  const [gender, setGender] = useState("여성");

  const [visibility, setVisibility] = useState("A"); // 'A' or 'P'

  // 1. 거리 UI 변경 (슬라이더 드래그 중일 때 - 화면만 바뀜)
  const handleDistanceChange = (value) => {
    setDistance(value);
  };

  const handleDistanceAfterChange = async (value) => {
    console.log("DB로 전송할 거리:", value);

    try {
      // 백엔드 컨트롤러로 요청 전송
      const response = await axios.put("http://localhost/api/mypage/distance", {
        memberNo: memberNo,
        searchDistance: value,
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

  // 나이 바뀔 때 실행되는 함수
  const handleAgeChange = (value) => {
    setAgeRange(value);
  };

  // 성별 변경 저장 함수
  const handleGenderSave = async (newGenderKor) => {
    console.log("선택한 성별(화면용):", newGenderKor);

    // 한글 -> DB 코드 변환 ('A': 모든 성별, 'M': 남성, 'F': 여성)
    let code = "A"; // 기본값 (모든 성별)

    if (newGenderKor === "남성") {
      code = "M";
    } else if (newGenderKor === "여성") {
      code = "F";
    }
    // "모든 성별"이면 위 조건 안 타서 그냥 "A"가 됨.

    try {
      const response = await axios.put("http://localhost/api/mypage/gender", {
        memberNo: memberNo,
        targetGender: code,
      });

      if (response.data.result === "success") {
        console.log(`✅ 성별 변경 완료! (${newGenderKor} -> ${code})`);
        setGender(newGenderKor); // 화면도 변경
      } else {
        alert("성별 변경 실패");
      }
    } catch (error) {
      console.error("❌ 성별 변경 에러:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  const handleAgeAfterChange = async (value) => {
    // value는 [19, 50] 처럼 배열로 들어옴
    const minAge = value[0];
    const maxAge = value[1];

    console.log(`DB로 전송할 연령대: ${minAge}세 ~ ${maxAge}세`);

    try {
      const response = await axios.put("http://localhost/api/mypage/age", {
        memberNo: memberNo,
        targetMinAge: minAge,
        targetMaxAge: maxAge,
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

  const handleVisibilityChange = async (e) => {
    const newCode = e.target.value; // 'A' or 'P'
    console.log("변경할 공개범위:", newCode);

    try {
      // 키 값 profileOpen으로 변경
      const response = await axios.put(
        "http://localhost/api/mypage/visibility",
        {
          memberNo: memberNo,
          profileOpen: newCode, // ★ 여기 수정됨!!
        },
      );

      if (response.data.result === "success") {
        console.log("✅ 공개범위 저장 완료:", newCode);
        setVisibility(newCode);
      } else {
        alert("저장 실패");
      }
    } catch (error) {
      console.error("❌ 공개범위 저장 에러:", error);
    }
  };

  return (
    <aside className="w-[360px] h-screen bg-[#FDFCFB] border-r border-gray-200 flex flex-col font-sans sticky top-0 left-0 z-50">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 10px;
          background-clip: padding-box;
          border:3px solid transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #c9c9c9;
        }
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
            채팅
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

          <div className="py-5 px-1 border-b border-gray-100">
            <div className="flex justify-between mb-4 text-sm font-medium">
              <span className="text-black">상대와의 거리</span>
              <span className="text-gray-800">{distance}km</span>
            </div>
            {/* 거리 슬라이더 (점 1개) */}
            {/* ★ 거리 슬라이더 부분 수정 */}
            <div className="px-2">
              <Slider
                min={1}
                max={50}
                value={distance}
                onChange={handleDistanceChange} // 드래그 중엔 UI만 변경
                onChangeComplete={handleDistanceAfterChange} // ★ 손 뗐을 때 DB 저장 함수 실행
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
            </div>
          </div>

          <div
            onClick={() => setIsGenderModalOpen(true)}
            className="flex justify-between items-center py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group px-1"
          >
            <span className="text-sm font-medium text-black group-hover:text-gray-900">
              보고 싶은 성별
            </span>
            <span className="text-sm text-gray-500 group-hover:text-gray-800">
              {gender} {">"}
            </span>
          </div>

          <div className="py-5 px-1 border-b border-gray-100">
            <div className="flex justify-between mb-4 text-sm font-medium">
              <span className="text-black">상대의 연령대</span>
              {/* 4. 배열 값 보여주기 (예: 19 - 39) */}
              <span className="text-gray-800">
                {ageRange[0]} - {ageRange[1]}
              </span>
            </div>

            {/* 5. Slider 컴포넌트 사용 */}
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
            </div>
          </div>
        </div>

        {/* 3. 프로필 공개 설정 */}
        <div className="mb-8">
          <h3 className="text-[15px] font-bold text-gray-800 mb-2 border-b border-gray-800 pb-3">
            프로필 공개 설정
          </h3>

          {/* 옵션 1: 모든 상대 (A) */}
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
              value="A" // 값 설정
              checked={visibility === "A"} // 상태랑 일치하면 체크
              onChange={handleVisibilityChange} // 클릭 시 바로 저장
              className="w-5 h-5 accent-[#EE4B6F] cursor-pointer"
            />
          </label>

          {/* 옵션 2: 비공개 모드 (P) */}
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
              value="P" // 값 설정
              checked={visibility === "P"} // 상태랑 일치하면 체크
              onChange={handleVisibilityChange} // 클릭 시 바로 저장
              className="w-5 h-5 accent-[#EE4B6F] cursor-pointer"
            />
          </label>
        </div>

        {/* 4. 차단 설정 */}
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

        {/* 5. 하단 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={() => setIsQnaModalOpen(true)}
            className="w-full py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          >
            QnA
          </button>
          <button className="w-full py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
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
      <BlockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <BlockListModal
        isOpen={isBlockListModalOpen}
        onClose={() => setIsBlockListModalOpen(false)}
      />

      <GenderModal
        isOpen={isGenderModalOpen}
        onClose={() => setIsGenderModalOpen(false)}
        currentGender={gender}
        onSave={handleGenderSave}
      />

      <QnaModal
        isOpen={isQnaModalOpen}
        onClose={() => setIsQnaModalOpen(false)}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </aside>
  );
};

export default MyPageSidebar;
