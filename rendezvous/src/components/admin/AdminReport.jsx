import React, { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import EmailStatus from "./EmailStatus";
import { ChevronLeft, ChevronRight, X } from "lucide-react"; // 아이콘 추가

const AdminReport = () => {
  const [reportList, setReportList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectType, setSelectType] = useState("all");

  const itemsPerPage = 10;
  const pageGroupSize = 10;

  const getReportData = async () => {
    try {
      const resp = await axiosApi.get("/admin/reports");
      setReportList(resp.data);
    } catch (error) {
      console.error("신고 목록 로딩 실패:", error);
    }
  };

  useEffect(() => {
    getReportData();
  }, []);

  const filteredList = reportList.filter((item) => {
    const status = item.reportStatus
      ? item.reportStatus.trim().toUpperCase()
      : "N";
    if (selectType === "all") return true;
    if (selectType === "unanswered") return status === "N";
    if (selectType === "answered") return status === "Y";
    return true;
  });

  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  const currentItems = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const [modal, setModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);

  const modalHandler = (report) => {
    setSelectedReport(report);
    setModal(true);
  };

  const processReportHandler = async () => {
    if (!window.confirm("해당 신고를 처리 완료하시겠습니까?")) return;
    setModal(false);
    setIsLoading(true);
    try {
      const resp = await axiosApi.post("/admin/report/process", {
        reportNo: selectedReport.reportNo,
        targetMemberNo: selectedReport.targetMemberNo,
      });
      if (resp.status === 200) {
        setIsLoading(false);
        alert("신고 처리가 완료되었습니다!");
        getReportData();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const isCompleted = selectedReport.reportStatus?.trim() === "Y";

  return (
    <div className="w-full h-full flex flex-col font-sans max-w-[1200px] mx-auto">
      {isLoading && <EmailStatus text={"신고 처리 중..."} />}

      {/* --- 이미지 확대 모달 --- */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[60] flex justify-center items-center bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setZoomImage(null)}
        >
          <button
            className="absolute top-5 right-5 text-white hover:text-gray-300 transition-colors"
            onClick={() => setZoomImage(null)}
          >
            <X size={40} />
          </button>
          <img
            src={zoomImage}
            alt="Enlarged"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* --- 신고 상세 모달 (반응형 적용) --- */}
      {modal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModal(false)}
          ></div>
          <div className="relative bg-white w-[95%] max-w-[650px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            <div className="bg-[#EE4B6F] p-5 shrink-0 relative">
              <h2 className="text-xl md:text-2xl font-bold text-white text-center">
                신고 상세 내용
              </h2>
              <button
                className="absolute top-5 right-5 text-white/80 hover:text-white cursor-pointer"
                onClick={() => setModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex-1 flex flex-col gap-6 custom-scrollbar">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-100 gap-3">
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-bold bg-white px-2 py-0.5 rounded border border-gray-200">
                        신고자
                      </span>
                      <span className="text-gray-800 font-bold truncate max-w-[100px]">
                        {selectedReport.reporterNickname}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {selectedReport.reportDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#EE4B6F] font-bold bg-white px-2 py-0.5 rounded border border-pink-100">
                      대상자
                    </span>
                    <span className="text-gray-800 font-bold truncate max-w-[100px]">
                      {selectedReport.targetNickname}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">
                  신고 유형
                </label>
                <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                  <p className="text-gray-600 font-black">
                    {selectedReport.codeName}
                  </p>
                </div>

                <label className="text-sm font-bold text-gray-700 mt-2">
                  신고 내용
                </label>
                <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm min-h-[120px]">
                  <h3 className="font-bold text-lg mb-3 pb-2 border-b border-gray-100 text-gray-800">
                    {selectedReport.reportTitle}
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedReport.reportContent}
                  </p>
                </div>

                <label className="text-sm font-bold text-gray-700 mt-2">
                  증거 자료{" "}
                  <span className="text-xs font-normal text-gray-400 ml-1">
                    (클릭하여 확대)
                  </span>
                </label>
                <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm min-h-[120px]">
                  {selectedReport.imageList &&
                  selectedReport.imageList.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.imageList.map((img, i) => (
                        <div
                          key={i}
                          className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-100"
                          onClick={() =>
                            setZoomImage(`http://localhost:80${img}`)
                          }
                        >
                          <img
                            src={`http://localhost:80${img}`}
                            alt={`증거 ${i + 1}`}
                            className="w-[100px] h-[100px] sm:w-[150px] object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm text-center py-4">
                      첨부된 증거 자료가 없습니다.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-4">
              {!isCompleted && (
                <button
                  className="flex-1 bg-[#EE4B6F] hover:bg-[#d63a5c] text-white py-3 rounded-xl font-bold shadow-md transition-all"
                  onClick={processReportHandler}
                >
                  신고 처리
                </button>
              )}
              <button
                className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 py-3 rounded-xl font-bold transition-all cursor-pointer"
                onClick={() => setModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 메인 컨텐츠 (헤더 + 리스트) --- */}
      <div className="w-full">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            신고 내역
          </h1>
          <select
            className="w-full sm:w-auto border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EE4B6F] cursor-pointer bg-white shadow-sm"
            value={selectType}
            onChange={(e) => {
              setSelectType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">전체 신고</option>
            <option value="unanswered">처리 미완료</option>
            <option value="answered">처리 완료</option>
          </select>
        </div>

        {/* [1] 모바일용 카드 리스트 뷰 (md:hidden) */}
        <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <div
                key={item.reportNo}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1 w-full mr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          item.reportStatus?.trim() === "Y"
                            ? "text-green-500 bg-green-50"
                            : "text-gray-400 bg-gray-100"
                        }`}
                      >
                        {item.reportStatus?.trim() === "Y" ? "완료" : "대기"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.reportDate}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1">
                      {item.reportTitle}
                    </h3>
                    <div className="flex gap-3 text-xs mt-1">
                      <span className="text-gray-500">
                        신고: {item.reporterNickname}
                      </span>
                      <span className="text-[#EE4B6F] font-medium">
                        대상: {item.targetNickname}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className={`w-full py-3 rounded-xl text-sm font-bold text-white shadow-sm mt-1 cursor-pointer transition-colors  ${
                    item.reportStatus?.trim() === "N"
                      ? "bg-[#EE4B6F] hover:bg-[#d63a5c]"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                  onClick={() => modalHandler(item)}
                >
                  {item.reportStatus?.trim() === "N" ? "처리하기" : "내역확인"}
                </button>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
              신고 내역이 없습니다.
            </div>
          )}
        </div>

        {/* [2] 데스크탑용 테이블 뷰 (hidden md:block) */}
        <div className="hidden md:block w-full overflow-hidden bg-white shadow-sm rounded-2xl border border-gray-100 mb-6">
          <table className="w-full table-fixed text-center border-collapse">
            <thead className="bg-[#fff0f3] text-gray-700 h-14 border-b-2 border-[#EE4B6F]/30 text-sm">
              <tr>
                <th className="w-[10%] font-bold">번호</th>
                <th className="w-[35%] font-bold">제목</th>
                <th className="w-[15%] font-bold">신고자</th>
                <th className="w-[15%] font-bold">대상자</th>
                <th className="w-[15%] font-bold">작성일</th>
                <th className="w-[10%] font-bold">상태</th>
                <th className="w-[10%] font-bold">관리</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item.reportNo}
                    className="hover:bg-gray-50/50 h-16 transition-colors"
                  >
                    <td>{item.reportNo}</td>
                    <td className="text-left px-6 truncate font-medium text-gray-700">
                      {item.reportTitle}
                    </td>
                    <td className="truncate">{item.reporterNickname}</td>
                    <td className="truncate text-[#EE4B6F] font-medium">
                      {item.targetNickname}
                    </td>
                    <td className="text-gray-400">{item.reportDate}</td>
                    <td>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.reportStatus?.trim() === "Y"
                            ? "text-green-600 bg-green-50 border border-green-100"
                            : "text-gray-500 bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {item.reportStatus?.trim() === "Y" ? "완료" : "대기"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm active:scale-95 ${
                          item.reportStatus?.trim() === "N"
                            ? "bg-[#EE4B6F] hover:bg-[#d63a5c]"
                            : "bg-gray-400 hover:bg-gray-500"
                        }`}
                        onClick={() => modalHandler(item)}
                      >
                        {item.reportStatus?.trim() === "N"
                          ? "처리하기"
                          : "내역확인"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-20 text-gray-400 text-lg">
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- 페이지네이션 --- */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8 pb-10 select-none">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1 mx-2">
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all shadow-sm ${
                    currentPage === n
                      ? "bg-[#EE4B6F] text-white transform scale-105"
                      : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReport;
