import React, { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import EmailStatus from "./EmailStatus";

const AdminReport = () => {
  const [reportList, setReportList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectType, setSelectType] = useState("all");

  const itemsPerPage = 10; // 페이지당 항목 수
  const pageGroupSize = 10; // 하단 페이지 번호 그룹 크기

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

  // 필터링 로직
  const filteredList = reportList.filter((item) => {
    const status = item.reportStatus
      ? item.reportStatus.trim().toUpperCase()
      : "N";

    if (selectType === "all") return true;
    if (selectType === "unanswered") return status === "N";
    if (selectType === "answered") return status === "Y";
    return true;
  });

  // --- 페이지네이션 계산 로직 ---
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 현재 페이지 그룹 계산 (예: 1~10페이지는 1그룹, 11~20페이지는 2그룹)
  const currentGroup = Math.ceil(currentPage / pageGroupSize);

  // 그룹의 시작 페이지와 끝 페이지 계산
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  // 현재 페이지에 보여줄 데이터 슬라이싱
  const currentItems = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // --- 모달 관련 로직 ---
  const [modal, setModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const modalHandler = (report) => {
    setSelectedReport(report);
    setModal(true);
  };

  const processReportHandler = async () => {
    if (!window.confirm("해당 신고를 처리 완료하시겠습니까?")) return;

    setModal(false);
    setIsLoading(true);

    try {
      console.log(
        `selectedReport.targetMemberNo : ${selectedReport.targetMemberNo}`
      );
      const resp = await axiosApi.post("/admin/report/process", {
        reportNo: selectedReport.reportNo,
        targetMemberNo: 2,
      });

      if (resp.status === 200) {
        setIsLoading(false);
        alert("신고 처리가 완료되었습니다!");
      }
      getReportData();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const isCompleted = selectedReport.reportStatus?.trim() === "Y";

  return (
    <div className="w-full h-full px-10 py-10 flex flex-col justify-center items-center font-sans">
      {isLoading && <EmailStatus text={"신고 처리 중..."} />}

      {modal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModal(false)}
          ></div>
          <div className="relative bg-white w-[650px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            <div className="bg-[#EE4B6F] p-6">
              <h2 className="text-2xl font-bold text-white text-center">
                신고 상세 내용
              </h2>
            </div>

            <div className="p-8 overflow-y-auto flex-1 flex flex-col gap-6 custom-scrollbar">
              {/* 상단 정보 카드 */}
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-bold bg-white px-2 py-0.5 rounded border border-gray-200">
                      신고자
                    </span>
                    <span className="text-gray-800 font-bold">
                      {selectedReport.reporterNickname}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#EE4B6F] font-bold bg-white px-2 py-0.5 rounded border border-pink-100">
                      대상자
                    </span>
                    <span className="text-gray-800 font-bold">
                      {selectedReport.targetNickname}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs text-gray-500 font-bold">
                    신고 일자
                  </span>
                  <span className="text-gray-600 font-medium">
                    {selectedReport.reportDate}
                  </span>
                </div>
              </div>

              {/* 내용 영역 */}
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
                  증거 자료
                </label>
                <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm min-h-[120px]">
                  {/* ✅ 더미데이터 -> 이미지로 추가하기 */}
                  <img src="/people.png" alt="증거 자료" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-4">
              {!isCompleted && (
                <button
                  className="bg-[#EE4B6F] hover:bg-[#d63a5c] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  onClick={processReportHandler}
                >
                  신고 처리
                </button>
              )}
              <button
                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold transition-all cursor-pointer"
                onClick={() => setModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1000px]">
        {/* 필터 셀렉트 */}
        <div className="mb-4 flex justify-end">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none shadow-sm focus:border-[#EE4B6F] cursor-pointer"
            value={selectType}
            onChange={(e) => {
              setSelectType(e.target.value);
              setCurrentPage(1); // 필터 변경 시 1페이지로 초기화
            }}
          >
            <option value="all">전체 신고</option>
            <option value="unanswered">처리 미완료</option>
            <option value="answered">처리 완료</option>
          </select>
        </div>

        {/* 테이블 */}
        <div className="w-full overflow-hidden bg-white shadow-sm rounded-lg border border-gray-100">
          <table className="w-full table-fixed text-center border-collapse">
            <thead className="bg-[#fff0f3] text-gray-700 h-12 border-b-2 border-[#EE4B6F]">
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
            <tbody className="text-sm text-gray-600">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item.reportNo}
                    className="border-b border-gray-100 hover:bg-gray-50 h-12 transition-colors"
                  >
                    <td>{item.reportNo}</td>
                    <td className="text-left pl-6 truncate font-medium text-gray-700">
                      {item.reportTitle}
                    </td>
                    <td className="truncate">{item.reporterNickname}</td>
                    <td className="truncate text-[#EE4B6F] font-medium">
                      {item.targetNickname}
                    </td>
                    <td>{item.reportDate}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          item.reportStatus?.trim() === "Y"
                            ? "text-green-600 bg-green-100"
                            : "text-gray-600 bg-gray-200"
                        }`}
                      >
                        {item.reportStatus?.trim() === "Y" ? "완료" : "대기"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`px-3 py-1 rounded text-xs font-bold text-white transition-all shadow-sm cursor-pointer ${
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
                  <td colSpan="7" className="py-10 text-gray-400">
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- 페이지네이션 (요청하신 스타일 적용) --- */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8 select-none">
            {/* 맨 처음으로 (<<) */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-[#EE4B6F] disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
            >
              &lt;&lt;
            </button>

            {/* 이전 페이지로 (<) */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-[#EE4B6F] disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
            >
              &lt;
            </button>

            {/* 페이지 번호 (1, 2, 3...) */}
            <div className="flex gap-1 mx-2">
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    currentPage === n
                      ? "bg-[#EE4B6F] text-white shadow-md scale-105"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* 다음 페이지로 (>) */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-[#EE4B6F] disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
            >
              &gt;
            </button>

            {/* 맨 끝으로 (>>) */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-[#EE4B6F] disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
            >
              &gt;&gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReport;
