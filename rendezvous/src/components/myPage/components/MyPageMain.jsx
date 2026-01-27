import React, { useState } from "react";
import ProfileEditModal from "../modals/ProfileEditModal";
import ProfilePreview from "../components/ProfilePreview";
import InterestEditModal from "../modals/InterestEditModal";
import SchoolEditModal from "../modals/SchoolEditModal";
import RegionEditModal from "../modals/RegionEditModal";

// 관심사 포맷팅 함수 (A, B, C 및 D 형태)
const formatInterests = (items) => {
  if (!items || items.length === 0) return "관심사를 선택해주세요";
  if (items.length === 1) return items[0];

  // 마지막 요소만 따로 떼어냄
  const lastItem = items[items.length - 1];
  // 나머지 요소들은 쉼표로 연결
  const restItems = items.slice(0, items.length - 1).join(", ");

  return `${restItems} 및 ${lastItem}`;
};

const MyPageMain = () => {
  const [activeTab, setActiveTab] = useState("edit");

  const [activeModal, setActiveModal] = useState(null);

  const [showInterestModal, setShowInterestModal] = useState(false);

  const [showSchoolModal, setShowSchoolModal] = useState(false);

  const [showRegionModal, setShowRegionModal] = useState(false);

  const [userData, setUserData] = useState({
    intro: "안녕하세요!",
    interests: ["언어 교환", "명상", "여행", "직장생활", "산책"],
    height: "",
    relationship: "진지한 연애",
    affection: "배려심 깊은 행동",
    education: "대학교 졸업",
    contact: "카톡 자주 하는편",
    zodiac: "염소자리",
    mbti: "ENFP",
    exercise: "가끔",
    drinking: "가끔 마심",
    smoking: "비흡연",
    social: "눈팅족",
    school: "중앙대학교",
    region: "",
    gender: "남성",
  });

  const MODAL_OPTIONS = {
    // 1. 기본 정보
    mbti: {
      title: "MBTI",
      type: "select",
      options: [
        "ISTJ",
        "ISFJ",
        "INFJ",
        "INTJ",
        "ISTP",
        "ISFP",
        "INFP",
        "INTP",
        "ESTP",
        "ESFP",
        "ENFP",
        "ENTP",
        "ESTJ",
        "ESFJ",
        "ENFJ",
        "ENTJ",
      ],
    },
    height: {
      title: "키",
      type: "number",
    },
    gender: {
      title: "성별",
      type: "select",
      options: ["남성", "여성"],
    },
    school: {
      title: "학교",
      type: "text",
    },
    region: {
      title: "거주 지역",
      type: "text", // "서울 강남구" 처럼 직접 입력
    },

    // 2. 연애/성향
    relationship: {
      title: "내가 찾는 관계",
      type: "select",
      options: ["진지한 연애", "편안한 친구", "가벼운 만남", "결혼 전제"],
    },
    affection: {
      title: "애정표현 스타일",
      type: "select",
      options: [
        "배려심 깊은 행동",
        "솔직한 말로 표현",
        "적극적인 스킨십",
        "무심한 듯 챙겨줌",
      ],
    },
    contact: {
      title: "연락 스타일",
      type: "select",
      options: [
        "카톡 자주 하는편",
        "전화가 편함",
        "만나는 게 좋음",
        "연락 텀이 긴 편",
        "용건만 간단히",
      ],
    },
    zodiac: {
      title: "별자리",
      type: "select",
      options: [
        "물병자리",
        "물고기자리",
        "양자리",
        "황소자리",
        "쌍둥이자리",
        "게자리",
        "사자자리",
        "처녀자리",
        "천칭자리",
        "전갈자리",
        "사수자리",
        "염소자리",
      ],
    },

    // 3. 라이프스타일/스펙
    education: {
      title: "학력",
      type: "select",
      options: [
        "고등학교 졸업",
        "전문대 졸업",
        "대학교 재학",
        "대학교 졸업",
        "대학원 재학",
        "대학원 졸업",
        "기타",
      ],
    },
    exercise: {
      title: "운동",
      type: "select",
      options: ["숨쉬기 운동만", "가끔 함", "주 2~3회", "매일 함", "헬창"],
    },
    drinking: {
      title: "음주",
      type: "select",
      options: ["마시지 않음", "가끔 마심", "즐기는 편", "술고래"],
    },
    smoking: {
      title: "흡연",
      type: "select",
      options: ["비흡연", "가끔 피움", "전자담배", "애연가"],
    },
    social: {
      title: "소셜 미디어",
      type: "select",
      options: ["인플루언서", "활발함", "눈팅족", "계정 없음"],
    },
  };

  // 모달 열기
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

  // 데이터 저장
  const handleSaveData = (key, newValue) => {
    setUserData((prev) => ({ ...prev, [key]: newValue }));
    setActiveModal(null); // 모달 닫기
  };

  // 관심사 저장 핸들러
  const handleSaveInterests = (newInterests) => {
    setUserData((prev) => ({ ...prev, interests: newInterests }));
    setShowInterestModal(false);
  };

  const handleIntroChange = (e) => {
    setUserData((prev) => ({ ...prev, intro: e.target.value }));
  };

  const handleSaveSchool = (schoolName) => {
    setUserData((prev) => ({ ...prev, school: schoolName }));
    setShowSchoolModal(false);
  };

  const handleSaveRegion = (regionName) => {
    setUserData((prev) => ({ ...prev, region: regionName }));
    setShowRegionModal(false);
  };

  // 데이터 구조 (이제 value를 state에서 가져옴)
  const profileSections = [
    {
      title: "키",
      items: [
        {
          key: "height", // key 추가 (모달 식별용)
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
          isPlaceholder: false,
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
          isPlaceholder: false,
        },
        {
          key: "education",
          icon: "🏫",
          label: "학력",
          value: userData.education,
          isPlaceholder: false,
        },
        {
          key: "contact",
          icon: "💌",
          label: "연락 스타일",
          value: userData.contact,
          isPlaceholder: false,
        },
        {
          key: "zodiac",
          icon: "🌌",
          label: "별자리",
          value: userData.zodiac,
          isPlaceholder: false,
        },
        {
          key: "mbti",
          icon: "📋",
          label: "MBTI",
          value: userData.mbti,
          isPlaceholder: false,
        },
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
          isPlaceholder: false,
        },
        {
          key: "drinking",
          icon: "🍺",
          label: "음주",
          value: userData.drinking,
          isPlaceholder: false,
        },
        {
          key: "smoking",
          icon: "🚬",
          label: "나의 평균 흡연량은?",
          value: userData.smoking,
          isPlaceholder: false,
        },
        {
          key: "social",
          icon: "📱",
          label: "소셜 미디어",
          value: userData.social,
          isPlaceholder: false,
        },
      ],
    },
    {
      title: "학교",
      items: [
        {
          key: "school",
          label: userData.school || "학교 입력",
          value: "",
          isPlaceholder: !userData.school,
          noIcon: true,
        },
      ],
    },
    {
      title: "거주 지역",
      items: [
        {
          key: "region",
          label: userData.region || "지역 입력",
          value: "",
          isPlaceholder: !userData.region,
          noIcon: true,
        },
      ],
    },
    {
      title: "성별",
      items: [
        {
          key: "gender",
          label: userData.gender, // 예: "여성"
          value: "",
          isPlaceholder: false,
          noIcon: true,
          // [추가] 읽기 전용 플래그 (이거 있으면 클릭 안 되게)
          readOnly: true,
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
          /* --- [A] 수정 탭 내용 --- */
          <>
            {/* 사진 그리드 */}
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

            {/* 자기소개 */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-2 border-b border-gray-200 pb-2">
                <h3 className="font-bold text-gray-800 text-sm">
                  {"{사용자명}"}님 소개
                </h3>
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

            {/* 관심사 */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-3">관심사</h4>
              <div
                onClick={() => setShowInterestModal(true)} // 클릭 시 모달 오픈
                className="flex justify-between items-center py-3 px-1 border border-gray-200 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-800 font-medium px-2 truncate">
                  {/* 포맷팅 함수 적용 */}
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
                      <div
                        key={i}
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
                        className={`flex justify-between items-center py-3 border-b border-gray-100 transition-colors ${
                          item.readOnly
                            ? "cursor-default"
                            : "cursor-pointer hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {!item.noIcon && (
                            <span className="text-base">{item.icon}</span>
                          )}
                          <span
                            className={`text-sm font-bold ${item.isPlaceholder ? "text-gray-500" : "text-gray-800"}`}
                          >
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.value && (
                            <span className="text-sm font-medium text-gray-800">
                              {item.value}
                            </span>
                          )}
                          {!item.readOnly && (
                            <span className="text-gray-400 text-sm ml-1">
                              {">"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 수정 버튼 */}
            <div className="mt-8 flex justify-center">
              <button className="bg-[#EE4B6F] hover:bg-[#ff3b60] text-white font-bold py-3 px-10 rounded-full shadow-md transition-all text-sm">
                수정하기
              </button>
            </div>
          </>
        ) : (
          /* --- [B] 미리보기 탭 내용 --- */
          /* 흰 박스 안에서 가운데 정렬만 해줌 */
          <div className="flex justify-center">
            <ProfilePreview data={userData} />
          </div>
        )}
      </div>

      {/* 모달 */}

      {showInterestModal && (
        <InterestEditModal
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

      {/* 학교 검색 모달 */}
      {showSchoolModal && (
        <SchoolEditModal
          currentSchool={userData.school}
          onClose={() => setShowSchoolModal(false)}
          onSave={handleSaveSchool}
        />
      )}

      {/* 거주 지역 모달 렌더링 */}
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
