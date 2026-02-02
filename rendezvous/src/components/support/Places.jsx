import React, { useState, useEffect } from "react";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Sparkles,
  MapPin,
  Search,
  ThumbsUp,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// --- [1] AI 추천 섹션 컴포넌트 ---
const AiRecommendation = ({ places, loading }) => {
  // 실제로는 백엔드에서 '추천 점수'가 높은 순으로 받아오거나 별도 API를 호출하는 것이 좋습니다.
  // 여기서는 로드된 데이터 중 랜덤으로 3개를 뽑아 '오늘의 AI 추천'으로 보여줍니다.
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (places.length > 0) {
      // 배열을 섞어서 상위 3개 추출 (AI 추천 시뮬레이션)
      const shuffled = [...places].sort(() => 0.5 - Math.random());
      setRecommendations(shuffled.slice(0, 3));
    }
  }, [places]);

  if (loading) return null;
  if (recommendations.length === 0) return null;

  return (
    <div className="mb-12 animate-fadeInUp">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gradient-to-tr from-[#FF4458] to-[#FF8A9B] rounded-full text-white shadow-lg animate-pulse">
          <Sparkles size={20} fill="currentColor" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            오늘의 AI 맞춤 데이트 코스
          </h3>
          <p className="text-xs text-gray-500">
            회원님의 취향과 현재 트렌드를 분석해 선정했어요.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((item) => {
          const p = item.place || item;
          return (
            <div
              key={`ai-${p.infoNo}`}
              className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* 이미지 영역 */}
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img
                  src={p.thumbUrl || p.imgUrl || "/placeholder.png"}
                  alt={p.infoName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/300x200?text=No+Image";
                  }}
                />
                <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-[#FF4458] shadow-sm">
                  AI 강력추천
                </div>
                <div className="absolute bottom-3 left-3 z-20 text-white">
                  <h4 className="font-bold text-lg leading-tight">
                    {p.infoName}
                  </h4>
                  <p className="text-xs opacity-90 flex items-center gap-1">
                    <MapPin size={10} />{" "}
                    {p.address
                      ? p.address.split(" ").slice(0, 2).join(" ")
                      : "위치 정보"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- [2] 태그 필터 컴포넌트 ---
const TagFilter = ({ tags, selectedTag, onTagSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onTagSelect("")}
        className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
          selectedTag === ""
            ? "bg-gray-800 text-white border-gray-800"
            : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
        }`}
      >
        # 전체
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
            selectedTag === tag
              ? "bg-[#FF4458] text-white border-[#FF4458] shadow-md transform scale-105"
              : "bg-white text-gray-500 border-gray-200 hover:border-[#FF4458] hover:text-[#FF4458]"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

// --- [3] 메인 Places 페이지 ---
const Places = () => {
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [places, setPlaces] = useState([]); // 서버 데이터
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState({});

  // 필터 상태
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [category, setCategory] = useState("ALL"); // ALL, RESTAURANT, CAFE
  const [selectedTag, setSelectedTag] = useState(""); // 단일 태그 선택

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const pageGroupSize = 10;

  // 추천 태그 목록 (실제 서비스 느낌)
  const recommendTags = [
    "#분위기좋은",
    "#데이트코스",
    "#뷰맛집",
    "#소개팅",
    "#디저트맛집",
    "#조용한",
    "#사진맛집",
    "#이색데이트",
  ];

  // --- 초기 지역 데이터 로드 ---
  useEffect(() => {
    axios
      .get("http://localhost:80/api/places/filters")
      .then((res) => setLocations(res.data))
      .catch((err) => console.error("지역 목록 로딩 실패:", err));
  }, []);

  // --- 장소 데이터 로드 (필터 변경 시 실행) ---
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (category !== "ALL") params.append("type", category);
        if (selectedCity && selectedCity !== "전체")
          params.append("city", selectedCity);
        if (selectedDistrict && selectedDistrict !== "전체")
          params.append("district", selectedDistrict);

        // 태그 선택 시 # 제거 후 전송
        if (selectedTag) params.append("tag", selectedTag.replace("#", ""));

        const url = `http://localhost:80/api/places?${params.toString()}`;
        const response = await axios.get(url);

        setPlaces(response.data);
        setCurrentPage(1); // 필터 바뀌면 1페이지로
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [selectedCity, selectedDistrict, category, selectedTag]);

  // --- 핸들러 함수들 ---
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedDistrict("");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCardClick = (id) => {
    navigate(`/places/${id}`);
  };

  // 태그 토글 핸들러
  const handleTagSelect = (tag) => {
    setSelectedTag((prev) => (prev === tag ? "" : tag));
  };

  // --- 페이지네이션 계산 ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = places.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(places.length / itemsPerPage);
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center py-10 px-4 font-sans">
      <div className="w-full max-w-6xl">
        {/* [AI 추천 섹션] - 데이터가 로딩 완료되고 장소가 있을 때만 표시 */}
        {!loading && places.length > 0 && (
          <AiRecommendation places={places} loading={loading} />
        )}

        {/* [메인 컨텐츠 박스] */}
        <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 p-8 mb-12">
          {/* 헤더 및 기본 필터 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Search className="text-[#FF4458]" />
                원하는 장소를 찾아보세요
              </h2>
              <p className="text-sm text-gray-400 mt-1 ml-1">
                지역과 카테고리를 선택하여 완벽한 데이트를 계획하세요.
              </p>
            </div>

            {/* 드롭다운 필터 그룹 */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm font-bold outline-none focus:border-[#FF4458] focus:ring-1 focus:ring-[#FF4458] transition-all cursor-pointer min-w-[100px]"
              >
                <option value="">전체 지역</option>
                {Object.keys(locations).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedCity}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm font-bold outline-none focus:border-[#FF4458] focus:ring-1 focus:ring-[#FF4458] transition-all cursor-pointer disabled:opacity-50 min-w-[100px]"
              >
                <option value="">전체 구/군</option>
                {selectedCity &&
                  locations[selectedCity]?.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-bold outline-none focus:border-[#FF4458] focus:ring-1 focus:ring-[#FF4458] transition-all cursor-pointer min-w-[110px]"
              >
                <option value="ALL">전체 보기</option>
                <option value="RESTAURANT">🍴 맛집</option>
                <option value="CAFE">☕ 카페</option>
              </select>
            </div>
          </div>

          {/* [태그 필터] */}
          <TagFilter
            tags={recommendTags}
            selectedTag={selectedTag}
            onTagSelect={handleTagSelect}
          />

          {/* [리스트 제목] */}
          <div className="mb-6 flex items-end gap-2 border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {category === "CAFE"
                ? "☕ 추천 카페"
                : category === "RESTAURANT"
                ? "🍴 추천 맛집"
                : "📍 추천 장소"}
            </h3>
            <span className="text-sm text-[#FF4458] font-bold mb-1">
              {places.length}건
            </span>
          </div>

          {/* [로딩 및 결과 없음 처리] */}
          {loading ? (
            <div className="text-center py-32 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#FF4458] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 font-medium">
                데이트 코스를 탐색 중입니다...
              </p>
            </div>
          ) : places.length === 0 ? (
            <div className="text-center py-32 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400">
                조건에 맞는 장소가 없어요. 😢
                <br />
                다른 지역이나 카테고리를 선택해보세요.
              </p>
            </div>
          ) : (
            /* [장소 리스트 그리드] */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-12">
              {currentItems.map((item) => {
                const p = item.place || item;
                return (
                  <div
                    key={p.infoNo}
                    onClick={() => handleCardClick(p.infoNo)}
                    className="group flex flex-col cursor-pointer"
                  >
                    {/* 카드 이미지 */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-3 shadow-sm group-hover:shadow-md transition-all">
                      <img
                        src={p.thumbUrl || p.imgUrl || "/placeholder.png"}
                        alt={p.infoName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/300x200?text=No+Image";
                        }}
                      />
                      {/* 카테고리 뱃지 */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-800 shadow-sm">
                        {p.locationType === "CAFE" ? "CAFE" : "FOOD"}
                      </div>
                      {/* 찜(하트) 버튼 예시 */}
                      <div className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition-colors">
                        <Heart size={16} />
                      </div>
                    </div>

                    {/* 카드 정보 */}
                    <div className="px-1">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#FF4458] transition-colors line-clamp-1">
                        {p.infoName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <MapPin size={12} className="text-gray-400" />
                        <span className="truncate">
                          {p.address
                            ? p.address.split(" ").slice(0, 2).join(" ")
                            : "위치 정보 없음"}
                        </span>
                      </div>

                      {/* 태그 리스트 */}
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {p.aiTags &&
                          p.aiTags
                            .replace(/,/g, " ")
                            .split(" ")
                            .filter((t) => t.startsWith("#"))
                            .slice(0, 2)
                            .map((t, i) => (
                              <span
                                key={i}
                                className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md"
                              >
                                {t}
                              </span>
                            ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* [페이지네이션] - 디자인 유지 */}
          {totalPages > 0 && (
            <div className="flex items-center justify-center gap-2 select-none pt-4 border-t border-gray-100">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-400 hover:text-[#FF4458] hover:bg-pink-50 disabled:opacity-30 transition-all"
              >
                <ChevronsLeft size={20} />
              </button>
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-400 hover:text-[#FF4458] hover:bg-pink-50 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-1 mx-2">
                {/* 간단하게 현재 페이지만 보여주거나 그룹핑 로직 사용 */}
                <span className="px-4 py-2 rounded-lg bg-[#FF4458] text-white text-sm font-bold shadow-md">
                  {currentPage}
                </span>
                <span className="py-2 text-gray-400 text-sm">
                  / {totalPages}
                </span>
              </div>

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-400 hover:text-[#FF4458] hover:bg-pink-50 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-400 hover:text-[#EE4B6F] hover:bg-pink-50 disabled:opacity-30 transition-all"
              >
                <ChevronsRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Places;
