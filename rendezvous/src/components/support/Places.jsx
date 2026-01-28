import React, { useState, useEffect } from "react";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Heart,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Places = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [places, setPlaces] = useState([]); // 서버 데이터
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const pageGroupSize = 10;

  // 태그 목록
  const recommendTags = [
    "#조용한",
    "#뷰맛집",
    "#주차편한",
    "#대화하기좋은",
    "#디저트맛집",
    "#노트북",
    "#사진맛집",
    "#이색데이트",
  ];

  // [API 호출] 데이터 가져오기
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        // 태그 선택 시 쿼리스트링 전달
        const tagQuery =
          selectedTags.length > 0
            ? `?tag=${selectedTags[0].replace("#", "")}`
            : "";
        const url = `http://localhost:8080/api/places${tagQuery}`;

        const response = await axios.get(url);
        setPlaces(response.data);
        setCurrentPage(1); // 필터 변경 시 1페이지로
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [selectedTags]);

  // 페이지네이션 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = places.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(places.length / itemsPerPage);

  // 페이지네이션 그룹 계산
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  // 핸들러
  const handleCardClick = (id) => {
    navigate(`/places/${id}`); // 상세 페이지로 이동
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags([]);
    } else {
      setSelectedTags([tag]);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* 1. 필터 섹션 */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-[#FF4458] fill-current" />
            오늘 어떤 데이트를 계획하시나요?
          </h2>
          <p className="text-gray-400 text-sm">
            원하는 분위기를 선택하면 AI가 딱 맞는 장소를 찾아줄게요.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex gap-2 w-full md:w-auto shrink-0">
            <select className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-[#FF4458] outline-none cursor-pointer">
              <option>서울시</option>
            </select>
            <select className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-[#FF4458] outline-none cursor-pointer">
              <option>강서구</option>
            </select>
          </div>

          <div className="flex-1 flex flex-wrap gap-2">
            {recommendTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border
                  ${
                    selectedTags.includes(tag)
                      ? "bg-[#FF4458] text-white border-[#FF4458] shadow-md transform scale-105"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#FF4458] hover:text-[#FF4458]"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <button className="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95">
            <Search size={18} /> AI 매칭
          </button>
        </div>
      </div>

      {/* 2. 리스트 섹션 */}
      <div className="w-full max-w-6xl mb-16">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 px-1">
          <span className="text-2xl">🤖</span> AI가 분석한 취향 저격 장소
        </h3>

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            데이터를 분석 중입니다...
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            조건에 맞는 장소가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {currentItems.map((item) => {
              const p = item.place;
              return (
                <div
                  key={p.infoNo}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col"
                  onClick={() => handleCardClick(p.infoNo)}
                >
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.imgUrl || "/placeholder.png"}
                      alt={p.infoName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/300?text=No+Image")
                      }
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm text-[10px] font-bold text-[#FF4458]">
                      {item.matchScore}% 일치
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#FF4458] transition-colors line-clamp-1">
                        {p.infoName}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-1 text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-md w-fit">
                        <MapPin size={12} />
                        {p.address ? p.address.split(" ")[1] : "서울"}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {p.aiTags &&
                          p.aiTags
                            .split(" ")
                            .slice(0, 2)
                            .map((t, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-pink-50 text-pink-500 px-2 py-1 rounded font-bold"
                              >
                                {t}
                              </span>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. 페이지네이션 */}
      {totalPages > 0 && (
        <div className="flex items-center justify-center gap-1.5 pb-12 select-none">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 hover:cursor-pointer"
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 mr-2 hover:cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`w-10 h-10 rounded-xl font-bold transition-all duration-200 flex items-center justify-center hover:cursor-pointer
                ${
                  currentPage === number
                    ? "bg-[#FF4458] text-white shadow-lg -translate-y-1"
                    : "bg-white text-gray-500 border border-gray-200 hover:text-[#FF4458]"
                }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 ml-2 hover:cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 hover:cursor-pointer"
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Places;
