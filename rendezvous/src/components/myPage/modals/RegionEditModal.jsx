import React, { useState, useEffect } from "react"; // [수정됨] useEffect 추가

// 더미 데이터
const MOCK_REGIONS = [
  "서울 강남구",
  "서울 서초구",
  "서울 마포구",
  "서울 용산구",
  "서울 성동구",
  "서울 송파구",
  "서울 영등포구",
  "서울 종로구",
  "경기 성남시 분당구",
  "경기 수원시",
  "경기 용인시",
  "경기 고양시",
  "경기 화성시",
  "인천 연수구",
  "인천 부평구",
  "부산 해운대구",
  "부산 부산진구",
  "대구 수성구",
  "대전 유성구",
  "광주 서구",
  "울산 남구",
  "제주시",
  "서귀포시",
  "세종특별자치시",
  "강원 춘천시",
  "강원 강릉시",
];

const RegionEditModal = ({ currentRegion, onClose, onSave }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const filteredRegions = MOCK_REGIONS.filter((region) =>
    region.includes(searchTerm),
  );

  return (
    // [1] 배경 클릭 시 닫기
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* [2] 내부 클릭 전파 방지 & 애니메이션 적용 */}
      <div
        className={`bg-white rounded-xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col max-h-[80vh] transform transition-all duration-300 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더: 취소 버튼 삭제 & 중앙 정렬 */}
        <div className="flex justify-center items-center px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">도시 수정</h2>
        </div>

        {/* 검색창 */}
        <div className="p-4 bg-white border-b border-gray-100">
          <label className="block text-xs font-bold text-gray-800 mb-2">
            지역 검색 (예: 마포구, 서울특별시)
          </label>
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
              placeholder="도시 이름을 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* 리스트 영역 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* [3] 검색어가 없을 때만 기본 옵션 표시 */}
          {!searchTerm && (
            <>
              {/* 현 위치 근처 */}
              <div
                onClick={() => onSave("현 위치(GPS)")}
                className="px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-blue-600 text-sm font-medium">
                  현 위치 근처
                </span>
              </div>

              {/* 거주 지역 표시 안 함 */}
              <div
                onClick={() => onSave("비공개")}
                className="px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-600 text-sm">
                  거주 지역을 표시하고 싶지 않음
                </span>
              </div>
            </>
          )}

          {/* 검색 결과 리스트 */}
          {filteredRegions.length > 0
            ? filteredRegions.map((region, index) => (
                <div
                  key={index}
                  onClick={() => onSave(region)}
                  className="px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center"
                >
                  <span
                    className={`text-sm ${region === currentRegion ? "text-[#EE4B6F] font-bold" : "text-gray-800"}`}
                  >
                    {region}
                  </span>
                  {region === currentRegion && (
                    <span className="text-[#EE4B6F] text-sm">✓</span>
                  )}
                </div>
              ))
            : // 검색어는 있는데 결과가 없을 때
              searchTerm && (
                <div className="p-10 text-center text-gray-400 text-sm">
                  검색 결과가 없습니다.
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default RegionEditModal;
