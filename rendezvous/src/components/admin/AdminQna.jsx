import React, { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import EmailStatus from "./EmailStatus";

const AdminQna = () => {
  const [qnaList, setQnaList] = useState([]); // DB 데이터
  const [currentPage, setCurrentPage] = useState(1);
  const [selectType, setSelectType] = useState("all");

  const itemsPerPage = 10;
  const pageGroupSize = 10;

  const getQnaData = async () => {
    try {
      const resp = await axiosApi.get("/qna/admin"); // 관리자용 전체 목록 API
      setQnaList(resp.data);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  useEffect(() => {
    getQnaData();
  }, []);

  const filteredList = qnaList.filter((item) => {
    const status = item.qnaStatus ? item.qnaStatus.trim().toUpperCase() : "N";

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
  const [answerModal, setAnswerModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [emailStatus, setEmailStatus] = useState(false);

  const [content, setContent] = useState({
    title: "",
    content: "",
    email: "",
    qnaNo: "",
  });

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
    <div className="w-full h-full px-10 py-10 flex flex-col justify-center items-center font-sans">
      {emailStatus && <EmailStatus />}

      {modal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModal(false)}
          ></div>
          <div className="relative bg-white w-[650px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            <div className="bg-[#EE4B6F] p-6">
              <h2 className="text-2xl font-bold text-white text-center">
                {answerModal ? "답변 작성하기" : "QnA 상세 내용"}
              </h2>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              {answerModal ? (
                <div className="flex flex-col gap-6">
                  <input
                    name="title"
                    value={content.title}
                    onChange={onChangeHandler}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#EE4B6F]"
                    placeholder="제목"
                  />
                  <textarea
                    name="content"
                    value={content.content}
                    onChange={onChangeHandler}
                    className="w-full h-[300px] border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#EE4B6F] resize-none"
                    placeholder="내용"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="font-bold text-gray-800 text-lg">
                        {selectedUser.qnaTitle}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {selectedUser.qnaDate}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                      <span>닉네임: {selectedUser.nickname}</span>
                      <span>이메일: {selectedUser.email}</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 min-h-[100px] whitespace-pre-wrap">
                      {selectedUser.qnaContent}
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                      <div className="font-bold text-[#EE4B6F] mb-2">
                        관리자 답변
                      </div>
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {selectedUser.answerContent}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-4">
              {answerModal ? (
                <>
                  <button
                    className="bg-[#EE4B6F] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#d63a5c]"
                    onClick={submitAnswerHandler}
                  >
                    전송하기
                  </button>
                  <button
                    className="bg-white border border-gray-300 text-gray-600 px-8 py-3 rounded-xl font-bold"
                    onClick={() => setAnswerModal(false)}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  {!isCompleted && (
                    <button
                      className="bg-[#EE4B6F] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#d63a5c]"
                      onClick={() => setAnswerModal(true)}
                    >
                      답변하기
                    </button>
                  )}
                  <button
                    className="bg-white border border-gray-300 text-gray-600 px-8 py-3 rounded-xl font-bold"
                    onClick={() => setModal(false)}
                  >
                    닫기
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1000px]">
        <div className="mb-4 flex justify-end">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#EE4B6F]"
            value={selectType}
            onChange={(e) => {
              setSelectType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">전체 회원</option>
            <option value="unanswered">답변 미완료</option>
            <option value="answered">답변 완료</option>
          </select>
        </div>

        <div className="w-full overflow-hidden bg-white shadow-sm rounded-lg border border-gray-100">
          <table className="w-full table-fixed text-center border-collapse">
            <thead className="bg-[#fff0f3] text-gray-700 h-12 border-b-2 border-[#EE4B6F]">
              <tr>
                <th className="w-[10%] font-bold">번호</th>
                <th className="w-[30%] font-bold">제목</th>
                <th className="w-[20%] font-bold">닉네임</th>
                <th className="w-[20%] font-bold">작성일</th>
                <th className="w-[10%] font-bold">상태</th>
                <th className="w-[10%] font-bold">관리</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item.qnaNo}
                    className="border-b border-gray-100 hover:bg-gray-50 h-12 transition-colors"
                  >
                    <td>{item.qnaNo}</td>
                    <td className="text-left pl-6 truncate">{item.qnaTitle}</td>
                    <td className="truncate">{item.nickname}</td>
                    <td>{item.qnaDate}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          item.qnaStatus?.trim() === "Y"
                            ? "text-green-600 bg-green-100"
                            : "text-gray-600 bg-gray-200"
                        }`}
                      >
                        {item.qnaStatus?.trim() === "Y" ? "완료" : "미완료"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`px-3 py-1 rounded text-xs font-bold text-white transition-all ${
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
                  <td colSpan="6" className="py-10 text-gray-400">
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
                className="p-2 hover:text-[#EE4B6F] disabled:opacity-30"
              >
                &lt;&lt;
              </button>
              <button
                onClick={() => setCurrentPage(startPage - 1)}
                disabled={currentGroup === 1}
                className="p-2 hover:text-[#EE4B6F] disabled:opacity-30"
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
                className="p-2 hover:text-[#EE4B6F] disabled:opacity-30"
              >
                &gt;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 hover:text-[#EE4B6F] disabled:opacity-30"
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

export default AdminQna;
