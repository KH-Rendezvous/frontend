import React, { useState, useEffect } from "react";
import axios from "axios";

// 모달 및 컴포넌트 임포트
import ProfileEditModal from "../modals/ProfileEditModal";
import ProfilePreview from "../components/ProfilePreview";
import InterestEditModal from "../modals/InterestEditModal";
import SchoolEditModal from "../modals/SchoolEditModal";
import RegionEditModal from "../modals/RegionEditModal";
import ProfileListItem from "../components/ProfileListItem";

// 관심사 포맷팅 함수
const formatInterests = (items) => {
  if (!items || items.length === 0) return "관심사를 선택해주세요";
  if (items.length === 1) return items[0];
  const lastItem = items[items.length - 1];
  const restItems = items.slice(0, items.length - 1).join(", ");
  return `${restItems} 및 ${lastItem}`;
};

const MyPageMain = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const [activeModal, setActiveModal] = useState(null);
  const [originalNickname, setOriginalNickname] = useState("");
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [masterCodes, setMasterCodes] = useState([]);

  const [userData, setUserData] = useState({
    nickname: "",
    intro: "",
    interests: [],
    height: "",
    relationship: "",
    affection: "",
    education: "",
    contact: "",
    zodiac: "",
    mbti: "",
    exercise: "",
    drinking: "",
    smoking: "",
    social: "",
    school: "",
    schNo: 0,
    region: "",
    regionId: 0,
    gender: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 공통 코드(MASTER_CODES) 가져오기
        try {
          const codeRes = await axios.get("http://localhost/api/mypage/codes");
          if (codeRes.data.result === "success") {
            console.log(
              "공통 코드 로드 완료:",
              codeRes.data.list.length + "개",
            );
            setMasterCodes(codeRes.data.list);
          }
        } catch (e) {
          console.warn("공통 코드 로딩 실패 (백엔드 확인 필요)");
        }

        // 내 프로필 정보 가져오기
        const profileRes = await axios.get(
          "http://localhost/api/mypage/profile",
        );
        if (profileRes.data.result === "success") {
          const dbData = profileRes.data.data;
          setOriginalNickname(dbData.nickname || "");

          setUserData({
            nickname: dbData.nickname || "",
            intro: dbData.intro || "",
            interests: dbData.interestList || [],
            height: dbData.height || "",
            mbti: dbData.mbti || "",

            // 학교 정보
            school: dbData.schoolName || "",
            schNo: dbData.schNo || 0,

            region:
              dbData.regionId === 0 || !dbData.regionName
                ? ""
                : dbData.regionName,
            regionId: dbData.regionId || 0,

            // 나머지 드롭다운 값들
            relationship: dbData.relationship || "",
            affection: dbData.affection || "",
            education: dbData.education || "",
            contact: dbData.contact || "",
            zodiac: dbData.zodiac || "",
            exercise: dbData.exercise || "",
            drinking: dbData.drinking || "",
            smoking: dbData.smoking || "",
            social: dbData.social || "",
            gender:
              dbData.gender === "M"
                ? "남성"
                : dbData.gender === "F"
                  ? "여성"
                  : "",
          });
        }
      } catch (error) {
        console.error("데이터 로딩 에러:", error);
      }
    };

    fetchData();
  }, []);

  // 카테고리별 옵션 이름만 뽑아주는 헬퍼 함수
  const getOptions = (categoryName) => {
    return masterCodes
      .filter((code) => code.category === categoryName) // 해당 카테고리만 필터링
      .map((code) => code.codeName); // 이름만 문자열 배열로 변환
  };

  // 설정 옵션 (상수)
  const MODAL_OPTIONS = {
    // DB에 없는 항목들은 기존대로 유지
    height: { title: "키", type: "number" },
    gender: { title: "성별", type: "select", options: ["남성", "여성"] },
    school: { title: "학교", type: "text" },
    region: { title: "거주 지역", type: "text" },

    // DB 데이터 사용 (getOptions 함수 이용)
    mbti: {
      title: "MBTI",
      type: "select",
      options: getOptions("MBTI"),
    },
    relationship: {
      title: "내가 찾는 관계",
      type: "select",
      options: getOptions("내가 찾는 관계"),
    },
    affection: {
      title: "애정표현 스타일",
      type: "select",
      options: getOptions("애정표현 스타일"),
    },
    education: {
      title: "학력",
      type: "select",
      options: getOptions("학력"),
    },
    contact: {
      title: "연락 스타일",
      type: "select",
      options: getOptions("연락 스타일"),
    },
    zodiac: {
      title: "별자리",
      type: "select",
      options: getOptions("별자리"),
    },
    exercise: {
      title: "운동",
      type: "select",
      options: getOptions("운동"),
    },
    drinking: {
      title: "음주",
      type: "select",
      options: getOptions("음주"),
    },
    smoking: {
      title: "흡연",
      type: "select",
      options: getOptions("흡연"),
    },
    social: {
      title: "소셜 미디어",
      type: "select",
      options: getOptions("소셜 미디어"),
    },
  };

  // 핸들러 함수들
  const openModal = (key) => {
    const config = MODAL_OPTIONS[key];
    if (config) {
      setActiveModal({
        key,
        ...config,
        currentValue: userData[key] || "",
      });
    }
  };

  const handleNicknameChange = (e) => {
    if (e.target.value.length > 10) return;
    setUserData((prev) => ({ ...prev, nickname: e.target.value }));
  };

  const handleSaveData = (key, newValue) => {
    setUserData((prev) => ({ ...prev, [key]: newValue }));
    setActiveModal(null);
  };

  const handleSaveInterests = (newInterests) => {
    setUserData((prev) => ({ ...prev, interests: newInterests }));
    setShowInterestModal(false);
  };

  const handleIntroChange = (e) => {
    setUserData((prev) => ({ ...prev, intro: e.target.value }));
  };

  const handleSaveSchool = (schoolObj) => {
    setUserData((prev) => ({
      ...prev,
      school: schoolObj.SCH_NAME,
      schNo: schoolObj.SCH_NO,
    }));

    // 모달 닫기
    setShowSchoolModal(false);
  };

  const handleSaveRegion = (regionObj) => {
    setUserData((prev) => ({
      ...prev,
      region: regionObj.FULL_ADDR, // 화면 보여주기용
      regionId: regionObj.REGION_ID, // DB 저장용
    }));
    setShowRegionModal(false);
  };

  // [수정하기] 버튼 클릭 시 (백엔드 전송)
  const handleFinalSubmit = async () => {
    if (userData.nickname.trim().length < 2) {
      alert("닉네임은 2글자 이상 입력해주세요.");
      return;
    }

    if (userData.nickname !== originalNickname) {
      try {
        const checkRes = await axios.get(
          "http://localhost/api/mypage/nickname/check",
          {
            params: { nickname: userData.nickname },
          },
        );

        if (checkRes.data > 0) {
          alert("이미 사용 중인 닉네임입니다.");
          return; // 함수 종료
        }
      } catch (error) {
        console.error("중복 체크 실패:", error);
        alert("서버 통신 오류");
        return;
      }
    }

    if (!window.confirm("프로필을 수정하시겠습니까?")) return;

    try {
      // DTO 매핑용 데이터 객체 생성
      const payload = {
        memberNo: 1,
        nickname: userData.nickname,
        intro: userData.intro,
        mbti: userData.mbti,
        height: userData.height,
        interestList: userData.interests,
        relationship: userData.relationship,
        affection: userData.affection,
        education: userData.education,
        contact: userData.contact,
        zodiac: userData.zodiac,
        exercise: userData.exercise,
        drinking: userData.drinking,
        smoking: userData.smoking,
        social: userData.social,
        regionId: userData.regionId ? userData.regionId : 0,
        schNo: userData.schNo ? userData.schNo : null,
      };

      const response = await axios.put(
        "http://localhost/api/mypage/profile",
        payload,
      );

      if (response.data.result === "success") {
        alert("프로필이 성공적으로 수정되었습니다.");
        setActiveTab("preview");
      } else {
        alert("수정 실패");
      }
    } catch (error) {
      console.error("프로필 수정 에러:", error);
      alert("서버 오류 발생");
    }
  };

  // 화면 렌더링 데이터 구조
  const profileSections = [
    {
      title: "키",
      items: [
        {
          key: "height",
          icon: "📏",
          label: "키 추가하기",
          value: userData.height ? `${userData.height}cm` : "추가",
          isPlaceholder: !userData.height,
        },
      ],
    },
    {
      title: "내가 찾는 관계",
      items: [
        {
          key: "relationship",
          icon: "👀",
          label: "내가 찾는 관계",
          value: userData.relationship,
        },
      ],
    },
    {
      title: "나에 대한 정보",
      items: [
        {
          key: "affection",
          icon: "🍀",
          label: "애정표현 스타일",
          value: userData.affection,
        },
        {
          key: "education",
          icon: "🏫",
          label: "학력",
          value: userData.education,
        },
        {
          key: "contact",
          icon: "💌",
          label: "연락 스타일",
          value: userData.contact,
        },
        { key: "zodiac", icon: "🌌", label: "별자리", value: userData.zodiac },
        { key: "mbti", icon: "📋", label: "MBTI", value: userData.mbti },
      ],
    },
    {
      title: "라이프스타일",
      items: [
        {
          key: "exercise",
          icon: "👟",
          label: "운동",
          value: userData.exercise,
        },
        {
          key: "drinking",
          icon: "🍺",
          label: "음주",
          value: userData.drinking,
        },
        {
          key: "smoking",
          icon: "🚬",
          label: "나의 평균 흡연량은?",
          value: userData.smoking,
        },
        {
          key: "social",
          icon: "📱",
          label: "소셜 미디어",
          value: userData.social,
        },
      ],
    },
    {
      title: "학교",
      items: [
        {
          key: "school",
          label:
            userData.schNo === 0 ? "비공개" : userData.school || "학교 입력",
          value: "",
          isPlaceholder: !userData.school && userData.schNo !== 0,
          noIcon: true,
        },
      ],
    },
    {
      title: "거주 지역",
      items: [
        {
          key: "region",
          label:
            userData.regionId === 0 ? "비공개" : userData.region || "지역 입력",
          value: "",
          isPlaceholder: !userData.region && userData.regionId !== 0,
          noIcon: true,
        },
      ],
    },
    {
      title: "성별",
      items: [
        {
          key: "gender",
          label: userData.gender,
          value: "",
          noIcon: true,
          readOnly: true, // 수정 불가
        },
      ],
    },
  ];

  return (
    <div className="w-full max-w-[720px] mx-auto pt-10 pb-20">
      {/* 탭 버튼 */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-full p-1 flex">
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === "edit"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            수정
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === "preview"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            미리보기
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-14">
        {activeTab === "edit" ? (
          <>
            {/* 사진 그리드 (추후 컴포넌트 분리 권장) */}
            <div className="grid grid-cols-3 gap-3 mb-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className="relative aspect-[3/4] bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-visible group cursor-pointer hover:border-gray-300 transition-colors"
                >
                  {num <= 2 ? (
                    <img
                      src={`https://placehold.co/150x200?text=Photo${num}`}
                      alt="profile"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-gray-300 text-2xl font-light">+</span>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-[#EE4B6F] text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm border-2 border-white z-10">
                    <span className="text-sm font-bold leading-none mb-0.5">
                      +
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-gray-500 mb-10">
              첫 번째 사진이 당신의 첫인상을 결정합니다! 나를 가장 잘 나타내는
              <br /> 사진을 첫 번째 대표 사진으로 설정해 보세요.
            </p>

            <div className="mb-10">
              {" "}
              {/* 여백 넉넉하게 */}
              <div className="flex justify-between mb-3">
                {" "}
                {/* mb-2 -> mb-3 */}
                <h3 className="font-bold text-gray-800 text-lg">닉네임</h3>
                <span className="text-xs text-gray-400">
                  {userData.nickname.length}/10
                </span>
              </div>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#EE4B6F] focus:ring-1 focus:ring-[#EE4B6F] transition-all bg-gray-50 focus:bg-white"
                placeholder="닉네임을 입력하세요"
                value={userData.nickname}
                onChange={handleNicknameChange}
                maxLength={10}
              />
              <p className="text-xs text-gray-400 mt-2 ml-1">
                Rendezvous 활동 시 사용될 이름입니다.
              </p>
            </div>

            {/* 자기소개 */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-2 border-b border-gray-200 pb-2">
                <h3 className="font-bold text-gray-800 text-lg">자기 소개</h3>
              </div>
              <div className="relative">
                <textarea
                  className="w-full h-24 text-sm text-gray-700 bg-transparent outline-none resize-none placeholder-gray-400"
                  placeholder="자기소개 글을 입력해보세요."
                  value={userData.intro}
                  onChange={handleIntroChange}
                ></textarea>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <p className="text-xs text-gray-400">
                  프로필에 SNS 계정이나 기타 연락처 정보를 게시하지 마세요.
                </p>
              </div>
            </div>

            {/* 관심사 (특별한 포맷이라 별도 처리) */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-3">관심사</h4>
              <div
                onClick={() => setShowInterestModal(true)}
                className="flex justify-between items-center py-3 px-1 border border-gray-200 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-800 font-medium px-2 truncate">
                  {formatInterests(userData.interests)}
                </span>
                <span className="text-gray-400 text-sm px-2 flex-shrink-0">
                  {">"}
                </span>
              </div>
            </div>

            {/* 상세 정보 섹션들 */}
            <div className="space-y-8 mb-10">
              {profileSections.map((section, idx) => (
                <div key={idx}>
                  <h4 className="text-lg font-bold text-gray-800 mb-1">
                    {section.title}
                  </h4>
                  <div>
                    {section.items.map((item, i) => (
                      <ProfileListItem
                        key={i}
                        item={item}
                        onClick={() => {
                          if (item.readOnly) return;

                          if (item.key === "school") {
                            setShowSchoolModal(true);
                          } else if (item.key === "region") {
                            setShowRegionModal(true);
                          } else if (item.key) {
                            openModal(item.key);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 수정 버튼 */}
            <div className="mt-8 flex justify-center">
              <button
                className="bg-[#EE4B6F] hover:bg-[#ff3b60] text-white font-bold py-3 px-10 rounded-full shadow-md transition-all text-sm"
                onClick={handleFinalSubmit}
              >
                수정하기
              </button>
            </div>
          </>
        ) : (
          /* 미리보기 탭 내용*/
          <div className="flex justify-center">
            <ProfilePreview data={userData} />
          </div>
        )}
      </div>

      {/* --- 모달들 --- */}

      {showInterestModal && (
        <InterestEditModal
          allInterestOptions={getOptions("관심사")}
          currentInterests={userData.interests}
          onClose={() => setShowInterestModal(false)}
          onSave={handleSaveInterests}
        />
      )}

      {activeModal && (
        <ProfileEditModal
          title={activeModal.title}
          type={activeModal.type}
          options={activeModal.options}
          defaultValue={activeModal.currentValue}
          onClose={() => setActiveModal(null)}
          onSave={(val) => handleSaveData(activeModal.key, val)}
        />
      )}

      {showSchoolModal && (
        <SchoolEditModal
          currentSchool={userData.school}
          onClose={() => setShowSchoolModal(false)}
          onSave={handleSaveSchool}
        />
      )}

      {showRegionModal && (
        <RegionEditModal
          currentRegion={userData.region}
          onClose={() => setShowRegionModal(false)}
          onSave={handleSaveRegion}
        />
      )}
    </div>
  );
};

export default MyPageMain;
