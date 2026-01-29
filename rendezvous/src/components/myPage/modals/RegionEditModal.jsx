import React, { useState, useEffect } from "react";
import axios from "axios"; // ★ axios 임포트 필수

const RegionEditModal = ({ currentRegion, onClose, onSave }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]); // ★ 서버 데이터 담을 곳
  const [animate, setAnimate] = useState(false);

  // 1. 애니메이션 효과
  useEffect(() => {
    setAnimate(true);
  }, []);

  // 2. 검색 로직
  useEffect(() => {
    const fetchRegions = async () => {
      // 1글자 미만이면 검색 안 함
      if (searchTerm.trim().length < 1) {
        setSearchResult([]);
        return;
      }

      try {
        const response = await axios.get("http://localhost/api/mypage/region", {
          params: { keyword: searchTerm },
        });

        if (response.data.list) {
          setSearchResult(response.data.list);
        } else {
          setSearchResult([]);
        }
      } catch (error) {
        console.error("지역 검색 실패:", error);
      }
    };

    // 타자 칠 때마다 요청 폭탄 방지 (0.1초 딜레이)
    const debounce = setTimeout(() => {
      fetchRegions();
    }, 100);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const filteredList = searchResult.filter((region) => region.REGION_ID !== 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col max-h-[80vh] transform transition-all duration-300 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex justify-center items-center px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">거주 지역 선택</h2>
        </div>

        {/* 검색창 */}
        <div className="p-4 bg-white border-b border-gray-100">
          <label className="block text-xs font-bold text-gray-800 mb-2">
            지역 검색 (예: 마포, 강남)
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
              placeholder="동/구/시 이름을 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* 리스트 영역 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* 검색어가 없을 때 기본 옵션 */}
          {!searchTerm && (
            <>
              {/* 현 위치 (나중에 GPS 연동 필요하면 그때 구현) */}
              <div
                onClick={() =>
                  onSave({ REGION_ID: 0, FULL_ADDR: "현 위치(GPS)" })
                }
                className="px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-blue-600 text-sm font-medium">
                  현 위치 근처 (GPS)
                </span>
              </div>

              {/* 비공개 */}
              <div
                onClick={() => onSave({ REGION_ID: 0, FULL_ADDR: "비공개" })}
                className="px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-600 text-sm">
                  거주 지역을 표시하고 싶지 않음
                </span>
              </div>
            </>
          )}

          {/* ★ DB 검색 결과 리스트 */}
          {filteredList.length > 0
            ? // 1. 진짜 보여줄 데이터가 있을 때
              filteredList.map((region) => (
                <div
                  key={region.REGION_ID}
                  onClick={() => onSave(region)}
                  className="px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center"
                >
                  <span
                    className={`text-sm ${region.FULL_ADDR === currentRegion ? "text-[#EE4B6F] font-bold" : "text-gray-800"}`}
                  >
                    {region.FULL_ADDR}
                  </span>
                  {region.FULL_ADDR === currentRegion && (
                    <span className="text-[#EE4B6F] text-sm">✓</span>
                  )}
                </div>
              ))
            : // 2. 검색어는 있는데(length >= 1), 보여줄 데이터가 없을 때 (비공개만 있어서 다 걸러진 경우 포함)
              searchTerm.length >= 1 && (
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
