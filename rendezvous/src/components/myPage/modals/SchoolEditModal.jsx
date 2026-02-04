import React, { useState, useEffect } from "react";
import axios from "axios"; // ★ axios 임포트 필수
import { axiosApi } from "../../../api/axiosAPI";

const SchoolEditModal = ({ currentSchool, onClose, onSave }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]); // ★ 서버에서 받아온 리스트 담을 곳
  const [animate, setAnimate] = useState(false);

  // 1. 마운트 시 애니메이션 시작
  useEffect(() => {
    setAnimate(true);
  }, []);

  // 2. ★ 검색어가 바뀔 때마다 서버로 요청 (실시간 검색)
  useEffect(() => {
    const fetchSchools = async () => {
      // 한 글자 이하는 검색 안 함 (서버 부하 방지 및 UX)
      if (searchTerm.trim().length < 2) {
        setSearchResult([]);
        return;
      }

      try {
        const response = await axiosApi.get("/api/mypage/school", {
          params: { keyword: searchTerm },
        });

        // 리스트가 있으면 세팅, 없으면 빈 배열
        if (response.data.list) {
          setSearchResult(response.data.list);
        } else {
          setSearchResult([]);
        }
      } catch (error) {
        console.error("학교 검색 에러:", error);
      }
    };

    // 타자 칠 때마다 요청 너무 많이 가지 않게 0.1초 딜레이 (디바운싱 효과)
    const debounce = setTimeout(() => {
      fetchSchools();
    }, 100);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

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
              placeholder="학교 이름을 입력하세요 (2글자 이상)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* 리스트 영역 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* 검색어가 없을 때만 '비공개' 옵션 표시 */}
          {!searchTerm && (
            <div
              onClick={() => onSave({ SCH_NO: 0, SCH_NAME: "비공개" })} // ★ 객체 형태로 전달
              className="px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-600 text-sm">
                학교 정보를 입력하기 싫음
              </span>
            </div>
          )}

          {/* ★ 검색 결과 리스트 (Mock 데이터 대신 searchResult 사용) */}
          {searchResult.length > 0
            ? searchResult.map((school) => (
                <div
                  key={school.SCH_NO} // ★ 고유 ID 사용
                  onClick={() => onSave(school)} // ★ 선택 시 학교 객체 전체를 부모에게 전달
                  className="px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center"
                >
                  <div>
                    {/* 학교 이름 */}
                    <span
                      className={`text-sm block ${school.SCH_NAME === currentSchool ? "text-[#EE4B6F] font-bold" : "text-gray-800"}`}
                    >
                      {school.SCH_NAME}
                    </span>
                    {/* ★ 지역 표시 (같은 이름 학교 구분용) */}
                    <span className="text-xs text-gray-400">
                      {school.SCH_REGION}
                    </span>
                  </div>

                  {/* 현재 선택된 학교 체크 표시 */}
                  {school.SCH_NAME === currentSchool && (
                    <span className="text-[#EE4B6F] text-sm">✓</span>
                  )}
                </div>
              ))
            : // 검색어는 있는데 결과가 없을 때
              searchTerm.length >= 2 && (
                <div className="p-10 text-center text-gray-400 text-sm">
                  검색 결과가 없습니다.
                </div>
              )}

          {/* 검색어가 짧을 때 안내 문구 */}
          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <div className="p-10 text-center text-gray-400 text-sm">
              두 글자 이상 입력해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolEditModal;
