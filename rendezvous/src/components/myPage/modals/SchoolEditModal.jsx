import React, { useState, useEffect } from "react"; // [중요] useEffect가 여기 꼭 있어야 합니다!

// 더미 데이터
const MOCK_SCHOOLS = [
  "서울대학교",
  "고려대학교",
  "연세대학교",
  "중앙대학교",
  "성균관대학교",
  "서강대학교",
  "한양대학교",
  "경희대학교",
  "서울시립대학교",
  "이화여자대학교",
  "한국외국어대학교",
  "동국대학교",
  "건국대학교",
  "홍익대학교",
  "국민대학교",
  "숭실대학교",
  "세종대학교",
  "단국대학교",
  "광운대학교",
  "명지대학교",
  "상명대학교",
  "가천대학교",
  "인하대학교",
  "아주대학교",
  "부산대학교",
  "경북대학교",
  "전남대학교",
  "충남대학교",
  "충북대학교",
  "전북대학교",
  "강원대학교",
  "제주대학교",
  "카이스트(KAIST)",
  "포항공과대학교(POSTECH)",
];

const SchoolEditModal = ({ currentSchool, onClose, onSave }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 애니메이션 상태
  const [animate, setAnimate] = useState(false);

  // 마운트 시 애니메이션 시작 (이 부분 때문에 useEffect가 필요함)
  useEffect(() => {
    setAnimate(true);
  }, []);

  const filteredSchools = MOCK_SCHOOLS.filter((school) =>
    school.includes(searchTerm),
  );

  return (
    // [1] 배경(Backdrop) 클릭 시 닫기
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* [2] 모달 내부 & 애니메이션 적용 */}
      <div
        className={`bg-white rounded-xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col max-h-[80vh] transform transition-all duration-300 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex justify-center items-center px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">출신 학교 입력</h2>
        </div>

        {/* 검색창 영역 */}
        <div className="p-4 bg-white">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="bg-gray-100 text-gray-900 text-sm rounded-lg block w-full pl-10 p-3 outline-none placeholder-gray-500"
              placeholder="학교 이름을 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* 리스트 영역 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* 검색어가 없을 때(!searchTerm)만 '학교 정보 입력하기 싫음' 표시 */}
          {!searchTerm && (
            <div
              onClick={() => onSave("비공개")}
              className="px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-600 text-sm">
                학교 정보를 입력하기 싫음
              </span>
            </div>
          )}

          {/* 검색 결과 리스트 */}
          {filteredSchools.length > 0 ? (
            filteredSchools.map((school, index) => (
              <div
                key={index}
                onClick={() => onSave(school)}
                className="px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center"
              >
                <span
                  className={`text-sm ${school === currentSchool ? "text-[#EE4B6F] font-bold" : "text-gray-800"}`}
                >
                  {school}
                </span>
                {school === currentSchool && (
                  <span className="text-[#EE4B6F] text-sm">✓</span>
                )}
              </div>
            ))
          ) : (
            // 검색어는 있는데 결과가 없을 때
            <div className="p-10 text-center text-gray-400 text-sm">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolEditModal;
