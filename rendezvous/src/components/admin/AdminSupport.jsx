import React, { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import EmailStatus from "./EmailStatus";
import { ChevronLeft, ChevronRight, X } from "lucide-react"; // 아이콘 추가

const AdminSupport = () => {
  const [support, setSupport] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectType, setSelectType] = useState("all");

  const itemsPerPage = 10;
  const pageGroupSize = 10;

  const getSupportData = async () => {
    try {
      // 프록시 설정에 맞춰 /api 추가
      const resp = await axiosApi.get("/api/main/support");
      console.log("QnA 데이터:", resp.data); // 데이터 확인용

      // 데이터가 배열인지 확인하고 넣기 (방어 코드)
      if (Array.isArray(resp.data)) {
        setSupport(resp.data);
      } else if (resp.data && Array.isArray(resp.data.data)) {
        setSupport(resp.data.data);
      } else {
        console.warn("QnA 데이터가 배열 형식이 아님:", resp.data);
        setSupport([]); // 이상하면 빈 배열
      }
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
      setSupport([]); // 에러 시 빈 배열
    }
  };

  useEffect(() => {
    getSupportData();
  }, []);

  // [수정 3] 필터링 시 배열 여부 확인 (2차 방어)
  const filteredSupport = Array.isArray(support)
    ? support.filter((item) => {
        const status = item.supportStatus
          ? item.supportStatus.trim().toUpperCase()
          : "N";
        if (selectType === "all") return true;
        if (selectType === "unanswered") return status === "N";
        if (selectType === "answered") return status === "Y";
        return true;
      })
    : [];

  const totalItems = filteredSupport.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const currentItems = filteredSupport.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const [modal, setModal] = useState(false);
  const [answerModal, setAnswerModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [emailStatus, setEmailStatus] = useState(false);

  const [content, setContent] = useState({
    title: "",
    content: "",
    email: "",
    supportNo: "",
  });

  const modalHandler = (user) => {
    setSelectedUser(user);
    setModal(true);
    setAnswerModal(false);

    setContent({
      title: `RE: ${user.supportTitle?.substring(0, 15)}...`,
      content: "",
      email: user.email,
      supportNo: user.supportNo,
    });
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const submitAnswerHandler = async () => {
    if (!content.title.trim()) return alert("답변 제목을 입력해주세요!");
    if (!content.content.trim()) return alert("답변 내용을 입력해주세요!");

    setEmailStatus(true);
    setModal(false);

    try {
      const resp = await axiosApi.post("/email/support", {
        supportNo: content.supportNo,
        title: content.title,
        content: content.content,
        email: selectedUser.email,
      });

      if (resp.status === 200) {
        alert("답변이 전송되었습니다.");
        getSupportData();
      }
    } catch (error) {
      console.log(error);
      alert("전송 실패...");
    } finally {
      setEmailStatus(false);
    }
  };

  const isCompleted = selectedUser.supportStatus?.trim() === "Y";

  return (
    <div className="w-full h-full flex flex-col font-sans">
      {emailStatus && <EmailStatus text={"메일 전송 중..."} />}

      {/* --- 모달 (반응형: w-[95%] max-w-[700px]) --- */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setModal(false)}
          ></div>
          <div className="relative bg-white w-[95%] max-w-[700px] max-h-[90vh] rounded-[1.5rem] shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            <div className="bg-[#EE4B6F] py-5 shrink-0 relative">
              <h2 className="text-xl md:text-2xl font-bold text-white text-center">
                {answerModal ? "답변 작성하기" : "문의 상세 내용"}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="absolute top-5 right-5 text-white/80 hover:text-white cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 md:p-10 overflow-y-auto">
              {answerModal ? (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-gray-700">제목</label>
                    <input
                      name="title"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#EE4B6F]"
                      value={content.title}
                      onChange={onChangeHandler}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-gray-700">내용</label>
                    <textarea
                      name="content"
                      className="w-full h-[250px] md:h-[350px] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#EE4B6F] resize-none"
                      placeholder="내용을 입력하세요"
                      value={content.content}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#F8F9FA] p-6 md:p-8 rounded-[1.5rem] border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-gray-200 pb-4 gap-2">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="bg-[#EE4B6F] text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full shrink-0">
                          질문
                        </span>
                        <span className="font-bold text-gray-800 text-lg md:text-xl truncate">
                          {selectedUser.supportTitle}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs md:text-sm shrink-0">
                        {selectedUser.supportDate}
                      </span>
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base min-h-[100px]">
                      {selectedUser.supportContent}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400">
                      보낸 사람: {selectedUser.email}
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="bg-[#fff0f3] p-6 md:p-8 rounded-[1.5rem] border border-pink-100">
                      <div className="mb-4 border-b border-pink-200 pb-2">
                        <span className="font-bold text-[#EE4B6F]">
                          관리자 답변
                        </span>
                      </div>
                      <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                        {selectedUser.answerContent ||
                          "저장된 답변 내용이 없습니다."}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex justify-center gap-3 border-t border-gray-100 pt-6">
                {answerModal ? (
                  <>
                    <button
                      className="flex-1 bg-[#EE4B6F] text-white py-3.5 rounded-xl font-bold hover:bg-[#d63a5c] transition-colors"
                      onClick={submitAnswerHandler}
                    >
                      전송하기
                    </button>
                    <button
                      className="flex-1 bg-white border border-gray-200 text-gray-500 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                      onClick={() => setAnswerModal(false)}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    {!isCompleted && (
                      <button
                        className="flex-1 bg-[#EE4B6F] text-white py-3.5 rounded-xl font-bold hover:bg-[#d63a5c] transition-colors"
                        onClick={() => setAnswerModal(true)}
                      >
                        답변하기
                      </button>
                    )}
                    <button
                      className="flex-1 bg-white border border-gray-200 text-gray-500 py-3.5 rounded-xl font-bold hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setModal(false)}
                    >
                      닫기
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 메인 컨텐츠 (헤더 + 리스트) --- */}
      <div className="w-full">
        {/* 헤더 & 필터 (반응형: 세로 -> 가로) */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            고객 지원
          </h1>
          <select
            className="w-full sm:w-auto border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EE4B6F] cursor-pointer bg-white shadow-sm"
            value={selectType}
            onChange={(e) => {
              setSelectType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">전체 문의</option>
            <option value="unanswered">답변 미완료</option>
            <option value="answered">답변 완료</option>
          </select>
        </div>

        {/* [1] 모바일용 카드 리스트 (md:hidden) */}
        <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
          {currentItems.length > 0 ? (
            currentItems.map((user) => (
              <div
                key={user.supportNo}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      user.supportStatus?.trim() === "Y"
                        ? "text-green-500 bg-green-50"
                        : "text-gray-400 bg-gray-100"
                    }`}
                  >
                    {user.supportStatus?.trim() === "Y" ? "완료" : "미완료"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {user.supportDate}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg line-clamp-1">
                  {user.supportTitle}
                </h3>
                <p className="text-xs text-gray-500">{user.email}</p>
                <button
                  className={`w-full py-3 rounded-xl text-sm font-bold text-white shadow-sm mt-1cursor-pointer ${
                    user.supportStatus?.trim() === "N"
                      ? "bg-[#EE4B6F]"
                      : "bg-gray-400"
                  }`}
                  onClick={() => modalHandler(user)}
                >
                  {user.supportStatus?.trim() === "N" ? "답변하기" : "상세보기"}
                </button>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed">
              문의 내역이 없습니다.
            </div>
          )}
        </div>

        {/* [2] 데스크탑용 테이블 (hidden md:block) */}
        <div className="hidden md:block w-full overflow-hidden bg-white shadow-sm rounded-2xl border border-gray-100">
          <table className="w-full table-fixed text-center border-collapse">
            <thead className="bg-[#fff0f3] text-gray-700 h-14 border-b-2 border-[#EE4B6F]/30 text-sm">
              <tr>
                <th className="w-[8%] font-bold">번호</th>
                <th className="w-[35%] font-bold">문의 내용 (요약)</th>
                <th className="w-[20%] font-bold">이메일</th>
                <th className="w-[15%] font-bold">작성일</th>
                <th className="w-[10%] font-bold">상태</th>
                <th className="w-[12%] font-bold">관리</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
              {currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <tr
                    key={user.supportNo}
                    className="hover:bg-gray-50/50 h-16 transition-colors"
                  >
                    <td>{user.supportNo}</td>
                    <td className="text-left px-6 truncate font-medium text-gray-700">
                      {user.supportTitle}
                    </td>
                    <td className="text-gray-500 truncate px-2">
                      {user.email}
                    </td>
                    <td className="text-gray-400">{user.supportDate}</td>
                    <td>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.supportStatus?.trim() === "Y"
                            ? "text-green-600 bg-green-50 border border-green-100"
                            : "text-gray-500 bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {user.supportStatus?.trim() === "Y" ? "완료" : "미완료"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm active:scale-95 cursor-pointer ${
                          user.supportStatus?.trim() === "N"
                            ? "bg-[#EE4B6F] hover:bg-[#d63a5c]"
                            : "bg-gray-400 hover:bg-gray-500"
                        }`}
                        onClick={() => modalHandler(user)}
                      >
                        {user.supportStatus?.trim() === "N"
                          ? "답변하기"
                          : "상세보기"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-gray-400 text-lg">
                    문의 내역이 존재하지 않습니다.
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

export default AdminSupport;
