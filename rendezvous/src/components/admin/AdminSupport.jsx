import React, { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import EmailStatus from "./EmailStatus";

const AdminSupport = () => {
  const [support, setSupport] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectType, setSelectType] = useState("all");

  const itemsPerPage = 10;
  const pageGroupSize = 10;

  const getSupportData = async () => {
    try {
      const resp = await axiosApi.get("/main/support");
      setSupport(resp.data);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  useEffect(() => {
    getSupportData();
  }, []);

  const filteredSupport = support.filter((item) => {
    const status = item.supportStatus
      ? item.supportStatus.trim().toUpperCase()
      : "N";
    if (selectType === "all") return true;
    if (selectType === "unanswered") return status === "N";
    if (selectType === "answered") return status === "Y";
    return true;
  });

  const totalItems = filteredSupport.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const currentItems = filteredSupport.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
    <div className="w-full h-full px-10 py-10 flex flex-col justify-center items-center font-sans">
      {emailStatus && <EmailStatus />}

      {modal && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setModal(false)}
          ></div>
          <div className="relative bg-white w-[700px] rounded-[1.5rem] shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            <div className="bg-[#EE4B6F] py-5">
              <h2 className="text-2xl font-bold text-white text-center">
                {answerModal ? "답변 작성하기" : "QnA 상세 내용"}
              </h2>
            </div>

            <div className="p-10">
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
                      className="w-full h-[350px] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#EE4B6F] resize-none"
                      placeholder="내용을 입력하세요"
                      value={content.content}
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#F8F9FA] p-8 rounded-[1.5rem] border border-gray-100">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#EE4B6F] text-white text-sm font-bold px-3 py-1 rounded-full">
                          질문
                        </span>
                        <span className="font-bold text-gray-800 text-xl">
                          {selectedUser.supportTitle}
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {selectedUser.supportDate}
                      </span>
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedUser.supportContent}
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="bg-[#fff0f3] p-8 rounded-[1.5rem] border border-pink-100">
                      <div className="mb-4 border-b border-pink-200 pb-2">
                        <span className="font-bold text-[#EE4B6F]">
                          관리자 답변
                        </span>
                      </div>
                      <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {selectedUser.answerContent ||
                          "저장된 답변 내용이 없습니다."}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-10 flex justify-center gap-4">
                {answerModal ? (
                  <>
                    <button
                      className="bg-[#EE4B6F] text-white px-12 py-3.5 rounded-2xl font-bold text-lg hover:bg-[#d63a5c]"
                      onClick={submitAnswerHandler}
                    >
                      전송하기
                    </button>
                    <button
                      className="bg-white border border-gray-200 text-gray-500 px-12 py-3.5 rounded-2xl font-bold text-lg"
                      onClick={() => setAnswerModal(false)}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    {!isCompleted && (
                      <button
                        className="bg-[#EE4B6F] text-white px-12 py-3.5 rounded-2xl font-bold text-lg hover:bg-[#d63a5c]"
                        onClick={() => setAnswerModal(true)}
                      >
                        답변하기
                      </button>
                    )}
                    <button
                      className="bg-white border border-gray-200 text-gray-500 px-12 py-3.5 rounded-2xl font-bold text-lg hover:bg-gray-50"
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

      <div className="w-full max-w-[1100px]">
        <div className="mb-6 flex justify-end">
          <select
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#EE4B6F]"
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

        <div className="w-full overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.5rem] border border-gray-100">
          <table className="w-full table-fixed text-center border-collapse">
            <thead className="bg-[#fff0f3] text-gray-700 h-14 border-b-2 border-[#EE4B6F]/30">
              <tr>
                <th className="w-[10%] font-bold">번호</th>
                <th className="w-[35%] font-bold">문의 내용 (요약)</th>
                <th className="w-[20%] font-bold">이메일</th>
                <th className="w-[15%] font-bold">작성일</th>
                <th className="w-[10%] font-bold">답변 상태</th>
                <th className="w-[10%] font-bold">관리</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600">
              {currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <tr
                    key={user.supportNo}
                    className="border-b border-gray-50 hover:bg-gray-50/50 h-14 transition-colors"
                  >
                    <td>{user.supportNo}</td>
                    <td className="text-left pl-10 truncate">
                      {user.supportTitle}
                    </td>
                    <td className="text-gray-500">{user.email}</td>
                    <td className="text-gray-400">{user.supportDate}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          user.supportStatus?.trim() === "Y"
                            ? "text-green-500 bg-green-50"
                            : "text-gray-400 bg-gray-100"
                        }`}
                      >
                        {user.supportStatus?.trim() === "Y" ? "완료" : "미완료"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all ${
                          user.supportStatus?.trim() === "N"
                            ? "bg-[#EE4B6F] shadow-pink-100 hover:bg-[#d63a5c]"
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

        {totalPages > 0 && (
          <div className="mt-10 flex flex-col items-center gap-8">
            <div className="flex items-center gap-3 text-gray-400 text-sm font-bold">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="hover:text-[#EE4B6F] disabled:opacity-30"
              >
                &lt;&lt;
              </button>
              <button
                onClick={() => setCurrentPage(startPage - 1)}
                disabled={currentGroup === 1}
                className="hover:text-[#EE4B6F] disabled:opacity-30"
              >
                &lt;
              </button>
              <div className="flex gap-2 mx-2">
                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`w-9 h-9 rounded-full transition-all ${
                      currentPage === n
                        ? "bg-[#EE4B6F] text-white shadow-lg"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(endPage + 1)}
                disabled={endPage === totalPages}
                className="hover:text-[#EE4B6F] disabled:opacity-30"
              >
                &gt;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="hover:text-[#EE4B6F] disabled:opacity-30"
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

export default AdminSupport;
