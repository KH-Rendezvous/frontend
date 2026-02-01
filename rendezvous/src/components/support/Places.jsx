import React, { useState, useEffect } from "react";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Sparkles,
  MapPin,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Places = () => {
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]); // 서버 데이터
  const [loading, setLoading] = useState(true);

  const [locations, setLocations] = useState({});

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [category, setCategory] = useState("ALL"); // ALL, RESTAURANT, CAFE
  const [selectedTags, setSelectedTags] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const pageGroupSize = 10;

  const recommendTags = [
    "#분위기좋은",
    "#데이트",
    "#뷰맛집",
    "#주차가능",
    "#디저트맛집",
    "#노트북",
    "#사진맛집",
    "#이색데이트",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:80/api/places/filters")
      .then((res) => setLocations(res.data))
      .catch((err) => console.error("지역 목록 로딩 실패:", err));
  }, []);

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
        if (selectedTags.length > 0)
          params.append("tag", selectedTags[0].replace("#", ""));

        const url = `http://localhost:80/api/places?${params.toString()}`;
        const response = await axios.get(url);

        setPlaces(response.data);
        setCurrentPage(1);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [selectedCity, selectedDistrict, category, selectedTags]);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = places.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(places.length / itemsPerPage);
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-[#FF4458] fill-current" />
            오늘 어떤 데이트를 계획하시나요?
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex gap-2 w-full md:w-auto shrink-0">
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-[#FF4458]"
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
              className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-[#FF4458] disabled:opacity-50"
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
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#FF4458]"
            >
              <option value="ALL">🍴☕ 전체보기</option>
              <option value="RESTAURANT">🍴 맛집만</option>
              <option value="CAFE">☕ 카페만</option>
            </select>
          </div>

          {/* 태그 버튼 */}
          {/* <div className="flex-1 flex flex-wrap gap-2">
            {recommendTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all border
                  ${
                    selectedTags.includes(tag)
                      ? "bg-[#FF4458] text-white border-[#FF4458] shadow-md"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#FF4458] hover:text-[#FF4458]"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div> */}
        </div>
      </div>

      <div className="w-full max-w-6xl mb-16">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 px-1">
          <span className="text-2xl">
            {category === "CAFE"
              ? "☕"
              : category === "RESTAURANT"
              ? "🍴"
              : "📍"}
          </span>
          {selectedCity || "전국"} {selectedDistrict}
          {category === "CAFE"
            ? " 인기 카페"
            : category === "RESTAURANT"
            ? " 맛집 리스트"
            : " 추천 장소"}
          <span className="ml-2 text-sm text-gray-400 font-normal">
            ({places.length}개)
          </span>
        </h3>

        {loading ? (
          <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#FF4458] border-t-transparent rounded-full animate-spin"></div>
            <p>데이터를 불러오는 중입니다...</p>
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 text-gray-400">
            조건에 맞는 장소가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {currentItems.map((item) => {
              const p = item.place || item;
              return (
                <div
                  key={p.infoNo}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all cursor-pointer flex flex-col h-full"
                  onClick={() => handleCardClick(p.infoNo)}
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={p.thumbUrl || p.imgUrl || "/placeholder.png"}
                      alt={p.infoName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/300x200?text=No+Image";
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-white">
                      {p.locationType === "CAFE" ? "☕ 카페" : "🍴 맛집"}
                    </div>
                    {/* {item.matchScore && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm text-[10px] font-bold text-[#FF4458]">
                        {item.matchScore}% 일치
                      </div>
                    )} */}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                        {p.infoName}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-1 text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-md w-fit">
                        <MapPin size={12} />
                        {p.address
                          ? p.address.split(" ").slice(0, 2).join(" ")
                          : "위치 미상"}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {p.aiTags &&
                          p.aiTags
                            .replace(/,/g, " ")
                            .split(" ")
                            .filter((t) => t.startsWith("#"))
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

      {totalPages > 0 && (
        <div className="flex items-center justify-center gap-1.5 pb-12 select-none">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="px-4 font-bold text-gray-700">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Places;
