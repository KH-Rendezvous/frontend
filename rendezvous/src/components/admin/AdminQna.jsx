import React, { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import EmailStatus from "./EmailStatus";
import { ChevronLeft, ChevronRight, X } from "lucide-react"; // 아이콘 추가

const AdminQna = () => {
  // --- 상태 관리 ---
  const [qnaList, setQnaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectType, setSelectType] = useState("all");

  const itemsPerPage = 10;
  const pageGroupSize = 10;

  // --- 데이터 불러오기 ---
  const getQnaData = async () => {
    try {
      const resp = await axiosApi.get("/admin/qna");
      setQnaList(resp.data);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  useEffect(() => {
    getQnaData();
  }, []);

  // --- 필터링 ---
  const filteredList = qnaList.filter((item) => {
    const status = item.qnaStatus ? item.qnaStatus.trim().toUpperCase() : "N";
    if (selectType === "all") return true;
    if (selectType === "unanswered") return status === "N";
    if (selectType === "answered") return status === "Y";
    return true;
  });

  // --- 페이지네이션 ---
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

  // --- 모달 상태 ---
  const [modal, setModal] = useState(false);
  const [answerModal, setAnswerModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [emailStatus, setEmailStatus] = useState(false);

  const [content, setContent] = useState({
    title: "",
    content: "",
    email: "",
    qnaNo: "",
  });

  // --- 핸들러 ---
  const modalHandler = (user) => {
    setSelectedUser(user);
    setModal(true);
    setAnswerModal(false);

    setContent({
      title: `RE: ${user.qnaTitle}`,
      content: "",
      email: user.memberEmail,
      qnaNo: user.qnaNo,
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
      const resp = await axiosApi.post("/email/qna", {
        qnaNo: content.qnaNo,
        title: content.title,
        content: content.content,
        email: selectedUser.email,
      });

      if (resp.status === 200) {
        alert("답변이 전송되었습니다.");
        getQnaData();
      }
    } catch (error) {
      console.log(error);
      alert("전송 실패...");
    } finally {
      setEmailStatus(false);
    }
  };

  const isCompleted = selectedUser.qnaStatus?.trim() === "Y";

  return (
    <div className="w-full h-full flex flex-col font-sans max-w-[1200px] mx-auto">
      {emailStatus && <EmailStatus text={"메일 전송 중..."} />}

      {/* --- 모달 (반응형: w-[95%] max-w-[650px]) --- */}
      {modal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModal(false)}
          ></div>
          <div className="relative bg-white w-[95%] max-w-[650px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            <div className="bg-[#EE4B6F] p-5 shrink-0 relative">
              <h2 className="text-xl md:text-2xl font-bold text-white text-center">
                {answerModal ? "답변 작성하기" : "QnA 상세 내용"}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="absolute top-5 right-5 text-white/80 hover:text-white cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto">
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
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3 gap-2">
                      <span className="font-bold text-gray-800 text-lg line-clamp-1">
                        {selectedUser.qnaTitle}
                      </span>
                      <span className="text-gray-400 text-sm whitespace-nowrap">
                        {selectedUser.qnaDate}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                      <span>닉네임: {selectedUser.nickname}</span>
                      <span>이메일: {selectedUser.email}</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 min-h-[100px] whitespace-pre-wrap leading-relaxed">
                      {selectedUser.qnaContent}
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                      <div className="font-bold text-[#EE4B6F] mb-2 border-b border-pink-200 pb-2">
                        관리자 답변
                      </div>
                      <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {selectedUser.answerContent}
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

      {/* --- 메인 컨텐츠 영역 --- */}
      <div className="w-full">
        {/* 헤더 & 필터 (모바일: 세로, 데스크탑: 가로) */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            QnA 관리
          </h1>
          <select
            className="w-full sm:w-auto border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EE4B6F] cursor-pointer bg-white shadow-sm"
            value={selectType}
            onChange={(e) => {
              setSelectType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">전체 QnA</option>
            <option value="unanswered">답변 미완료</option>
            <option value="answered">답변 완료</option>
          </select>
        </div>

        {/* [1] 모바일용 카드 리스트 뷰 (md:hidden) */}
        <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <div
                key={item.qnaNo}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1 w-full mr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          item.qnaStatus?.trim() === "Y"
                            ? "text-green-500 bg-green-50"
                            : "text-gray-400 bg-gray-100"
                        }`}
                      >
                        {item.qnaStatus?.trim() === "Y" ? "답변완료" : "대기중"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.qnaDate}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1">
                      {item.qnaTitle}
                    </h3>
                    <p className="text-xs text-gray-500">{item.nickname}</p>
                  </div>
                </div>

                <button
                  className={`w-full py-3 rounded-xl text-sm font-bold text-white shadow-sm mt-1 transition-colors ${
                    item.qnaStatus?.trim() === "N"
                      ? "bg-[#EE4B6F] hover:bg-[#d63a5c]"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                  onClick={() => modalHandler(item)}
                >
                  {item.qnaStatus?.trim() === "N" ? "답변하기" : "상세보기"}
                </button>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
              문의 내역이 없습니다.
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
                <th className="w-[15%] font-bold">닉네임</th>
                <th className="w-[20%] font-bold">작성일</th>
                <th className="w-[10%] font-bold">상태</th>
                <th className="w-[10%] font-bold">관리</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item.qnaNo}
                    className="hover:bg-gray-50/50 h-16 transition-colors"
                  >
                    <td>{item.qnaNo}</td>
                    <td className="text-left px-6 truncate font-medium text-gray-700">
                      {item.qnaTitle}
                    </td>
                    <td className="truncate">{item.nickname}</td>
                    <td className="text-gray-400">{item.qnaDate}</td>
                    <td>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.qnaStatus?.trim() === "Y"
                            ? "text-green-600 bg-green-50 border border-green-100"
                            : "text-gray-500 bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {item.qnaStatus?.trim() === "Y" ? "완료" : "미완료"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm active:scale-95 cursor-pointer ${
                          item.qnaStatus?.trim() === "N"
                            ? "bg-[#EE4B6F] hover:bg-[#d63a5c]"
                            : "bg-gray-400 hover:bg-gray-500"
                        }`}
                        onClick={() => modalHandler(item)}
                      >
                        {item.qnaStatus?.trim() === "N"
                          ? "답변하기"
                          : "상세보기"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-gray-400 text-lg">
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

export default AdminQna;
