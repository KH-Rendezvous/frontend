import React, { useState } from "react";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Heart,
  MapPin,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const nav = useNavigate();
  const itemsPerPage = 8;
  const pageGroupSize = 10;

  const allItems = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    title: `투썸플레이스 ${i + 1}호점`,
    location: "서울 강서구",
    category: "카페",
    image: null,
  }));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  const currentGroup = Math.ceil(currentPage / pageGroupSize);

  const startPage = (currentGroup - 1) * pageGroupSize + 1;

  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleFirstPage = () => {
    setCurrentPage(1);
    scrollToTop();
  };

  const handlePrevGroup = () => {
    const newPage = startPage - 1;
    if (newPage >= 1) {
      setCurrentPage(newPage);
      scrollToTop();
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  const handleNextGroup = () => {
    const newPage = startPage + pageGroupSize;
    if (newPage <= totalPages) {
      setCurrentPage(newPage);
      scrollToTop();
    }
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
    scrollToTop();
  };

  const handleCardClick = (id) => {
    nav(`/places/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
          <select className="flex-1 max-w-xs px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer hover:bg-white text-gray-700">
            <option>서울시</option>
          </select>
          <select className="flex-1 max-w-xs px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer hover:bg-white text-gray-700">
            <option>강서구</option>
          </select>
          <select className="flex-1 max-w-xs px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer hover:bg-white text-gray-700">
            <option>종류</option>
          </select>
        </div>
        <div className="flex justify-center">
          <button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-16 rounded-full shadow-lg hover:shadow-pink-200 hover:-translate-y-0.5 transition-all text-lg">
            <Search size={20} />
            탐색
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col"
            onClick={() => handleCardClick(item.id)}
          >
            <div className="relative h-48 bg-pink-50 flex items-center justify-center overflow-hidden">
              <div className="text-pink-400 group-hover:scale-110 transition-transform duration-300 flex flex-col items-center">
                <Heart
                  size={52}
                  fill="#f472b6"
                  className="text-pink-400 mb-2"
                />
                <span className="font-bold text-pink-500 text-lg">
                  Rendezvous
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-pink-600 line-clamp-1">
                  {item.title}
                </h3>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-gray-500 text-sm bg-gray-100 px-2.5 py-1 rounded-lg">
                  <MapPin size={14} />
                  {item.location}
                </div>
                <span className="text-xs font-medium text-pink-500 bg-pink-50 border border-pink-100 px-2.5 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 pb-12 select-none">
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:cursor-pointer"
        >
          <ChevronsLeft size={20} />
        </button>

        <button
          onClick={handlePrevGroup}
          disabled={startPage === 1}
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all mr-2 hover:cursor-pointer"
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
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-200 -translate-y-1"
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200 hover:border-pink-200 hover:text-pink-500"
              }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={handleNextGroup}
          disabled={endPage === totalPages}
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all ml-2 hover:cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>

        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:cursor-pointer"
        >
          <ChevronsRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
