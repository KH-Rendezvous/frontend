import React, { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import EmailStatus from "./EmailStatus";

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
  const [adminComment, setAdminComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const modalHandler = (report) => {
    setSelectedReport(report);
    setAdminComment(report.adminComment || "");
    setModal(true);
  };
  const processReportHandler = async () => {
    if (!adminComment.trim()) return alert("조치 내용을 입력해주세요.");
    if (!window.confirm("해당 신고를 처리 완료하시겠습니까?")) return;

    setModal(false);
    setIsLoading(true);

    try {
      const resp = await axiosApi.post("/admin/report/process", {
        reportNo: selectedReport.reportNo,
        adminComment: adminComment,
      });

      if (resp.status === 200 || resp.data > 0) {
        setIsLoading(false);
        setTimeout(() => {
          alert("처리가 완료되었습니다.");
          getReportData();
        }, 100);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const isCompleted = selectedReport.reportStatus?.trim() === "Y";

  return (
    <div className="w-full h-full px-10 py-10 flex flex-col justify-center items-center font-sans">
      {isLoading && <EmailStatus />}

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

            <div className="p-8 overflow-y-auto flex-1 flex flex-col gap-6">
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

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">
                  신고 내용
                </label>
                <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm min-h-[150px]">
                  <h3 className="font-bold text-lg mb-3 pb-2 border-b border-gray-100 text-gray-800">
                    {selectedReport.reportTitle}
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedReport.reportContent}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">
                  {isCompleted
                    ? "관리자 조치 내용 (완료됨)"
                    : "관리자 조치 메모 작성"}
                </label>
                <textarea
                  className={`w-full h-[100px] border rounded-xl px-4 py-3 outline-none transition-all resize-none text-sm
                    ${
                      isCompleted
                        ? "bg-gray-100 text-gray-500 border-gray-200"
                        : "bg-white border-gray-300 focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20"
                    }`}
                  placeholder={
                    isCompleted
                      ? ""
                      : "처리 내용을 입력하세요 (예: 경고 조치함, 정지 처리함)"
                  }
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  readOnly={isCompleted}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-4">
              {!isCompleted && (
                <button
                  className="bg-[#EE4B6F] hover:bg-[#d63a5c] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  onClick={processReportHandler}
                >
                  처리 완료
                </button>
              )}
              <button
                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold transition-all"
                onClick={() => setModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1000px]">
        <div className="mb-4 flex justify-end">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none shadow-sm focus:border-[#EE4B6F]"
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
                    <td className="text-left pl-6 truncate">
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
                        className={`px-3 py-1 rounded text-xs font-bold text-white transition-all ${
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

        {totalPages > 0 && (
          <div className="flex flex-col items-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 hover:text-[#EE4B6F] disabled:opacity-30 transition-colors"
              >
                &lt;&lt;
              </button>
              <button
                onClick={() => setCurrentPage(startPage - 1)}
                disabled={currentGroup === 1}
                className="p-2 hover:text-[#EE4B6F] disabled:opacity-30 transition-colors"
              >
                &lt;
              </button>
              <div className="flex gap-1 mx-2">
                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                      currentPage === n
                        ? "bg-[#EE4B6F] text-white font-bold shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(endPage + 1)}
                disabled={endPage === totalPages}
                className="p-2 hover:text-[#EE4B6F] disabled:opacity-30 transition-colors"
              >
                &gt;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 hover:text-[#EE4B6F] disabled:opacity-30 transition-colors"
              >
                &gt;&gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReport;
