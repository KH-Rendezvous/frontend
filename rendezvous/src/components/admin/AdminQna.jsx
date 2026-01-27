import React, { useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import EmailStatus from "./EmailStatus";

const AdminQna = () => {
  // 더미 데이터 생성
  const allUsers = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    email: "jaehun4086@naver.com",
    nickname: `닉네임${i + 1}`,
    date: "2025-12-07",
    status: i % 3 === 0 ? "미완료" : "완료",
    content: "매칭은 어떻게 이루어지나요? 상세한 답변 부탁드립니다.",
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [selectType, setSelectType] = useState("전체 회원");
  const [answerModal, setAnswerModal] = useState(false);
  const itemsPerPage = 10;
  const pageGroupSize = 10;

  // 필터링 로직
  const filteredUser = allUsers.filter((user) => {
    if (selectType === "전체 회원") return true;
    if (selectType === "답변 미완료") return user.status === "미완료";
    if (selectType === "답변 완료") return user.status === "완료";
    return true;
  });

  // 페이지네이션 로직
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUser.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUser.length / itemsPerPage);
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 모달 관련 state
  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [content, setContent] = useState({
    title: "",
    content: "",
    email: selectedUser.email,
    memberNo: 1,
  });
  const [emailStatus, setEmailStatus] = useState(false);

  // 핸들러 함수들
  const modalHandler = (user) => {
    setSelectedUser(user); // 선택된 유저 정보 세팅 (빈 객체 초기화 제거)
    setModal(true);
    setAnswerModal(false); // 초기엔 상세 보기 모드
    setContent({ title: "", content: "", memberNo: user.id }); // 초기화
  };

  const answerModalHandler = () => {
    setAnswerModal(true);
    // 답변하기 누를 때 제목 자동 세팅 (선택 사항)
    setContent((prev) => ({
      ...prev,
      title: `RE: ${selectedUser.content.substring(0, 10)}... 에 대한 답변`,
    }));
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitAnswerHandler = async () => {
    setEmailStatus(true);
    setModal(false);
    try {
      const resp = await axiosApi.post("/email/qna", {
        title: content.title,
        content: content.content,
        email: selectedUser.email,
        memberNo: content.memberNo,
      });

      if (resp.status === 200) {
        alert("답변이 완료되었습니다.");
        setEmailStatus(false);
      }
    } catch (error) {
      console.log(error);
      alert("답변 실패...");
      setEmailStatus(false);
    }
  };

  return (
    <div className="w-full h-full px-10 py-10 flex flex-col justify-center items-center">
      {emailStatus ? <EmailStatus /> : null}

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
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-gray-700 text-sm">
                      제목
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20 transition-all text-gray-700"
                      placeholder="답변 제목을 입력해주세요."
                      value={content.title}
                      onChange={onChangeHandler}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-gray-700 text-sm">
                      내용
                    </label>
                    <textarea
                      name="content"
                      className="w-full h-[300px] border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20 transition-all resize-none text-gray-700"
                      placeholder="답변 내용을 자세히 입력해주세요."
                      value={content.content}
                      onChange={onChangeHandler}
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div className="flex gap-2 items-center">
                        <span className="bg-[#EE4B6F] text-white text-xs px-2 py-1 rounded-full">
                          질문
                        </span>
                        <span className="font-bold text-gray-800 text-lg">
                          {selectedUser.content &&
                          selectedUser.content.length > 20
                            ? selectedUser.content.substring(0, 20) + "..."
                            : selectedUser.content}
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {selectedUser.date}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-500 font-bold">
                        작성자: {selectedUser.nickname}
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 min-h-[200px] whitespace-pre-wrap leading-relaxed">
                        {selectedUser.content}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 하단 버튼 영역 */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-4">
              {answerModal ? (
                <>
                  <button
                    className="bg-[#EE4B6F] hover:bg-[#d63a5c] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    onClick={submitAnswerHandler}
                  >
                    전송하기
                  </button>
                  <button
                    className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold transition-all"
                    onClick={() => setAnswerModal(false)}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-[#EE4B6F] hover:bg-[#d63a5c] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    onClick={answerModalHandler}
                  >
                    답변하기
                  </button>
                  <button
                    className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold transition-all"
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
      {/* ---------------- 모달 영역 끝 ---------------- */}

      <div className="w-full max-w-[1000px]">
        {/* 상단 필터 select */}
        <div className="mb-4 flex justify-end">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none shadow-sm focus:border-[#EE4B6F] transition-colors"
            onChange={(e) => {
              setSelectType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>전체 회원</option>
            <option>답변 미완료</option>
            <option>답변 완료</option>
          </select>
        </div>

        {/* 테이블 섹션 */}
        <div className="w-full overflow-x-auto mb-8 bg-white shadow-sm rounded-lg border border-gray-100">
          <table className="w-full table-fixed text-center border-collapse">
            <thead className="bg-[#fff0f3] text-gray-700 h-12 border-b-2 border-[#EE4B6F]">
              <tr>
                <th className="w-[10%] py-3 font-bold">번호</th>
                <th className="w-[30%] py-3 font-bold">제목</th>
                <th className="w-[20%] py-3 font-bold">닉네임</th>
                <th className="w-[20%] py-3 font-bold">가입일</th>
                <th className="w-[10%] py-3 font-bold">상태</th>
                <th className="w-[10%] py-3 font-bold">관리</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-600">
              {currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 h-12 transition-colors"
                  >
                    <td className="truncate px-2">{user.id}</td>
                    <td className="truncate px-2 text-left pl-6">
                      {user.content}
                    </td>
                    <td className="truncate px-2">{user.nickname}</td>
                    <td className="truncate px-2">{user.date}</td>
                    <td className="truncate px-2 font-medium">
                      {user.status === "미완료" ? (
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
                          미완료
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">
                          완료
                        </span>
                      )}
                    </td>
                    <td className="px-2">
                      <button
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                          user.status === "미완료"
                            ? "bg-[#EE4B6F] hover:bg-[#d63a5c] text-white shadow-sm"
                            : "bg-gray-300 text-white cursor-not-allowed"
                        }`}
                        onClick={() => {
                          modalHandler(user);
                        }}
                      >
                        상세
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

        {/* 페이지네이션 UI */}
        {totalPages > 0 && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 hover:text-[#EE4B6F] disabled:opacity-30 transition-colors"
              >
                &lt;&lt;
              </button>

              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 hover:text-[#EE4B6F] disabled:opacity-30 transition-colors"
              >
                &lt;
              </button>

              <div className="flex gap-1 mx-2">
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all
                        ${
                          currentPage === number
                            ? "bg-[#EE4B6F] text-white font-bold shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
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

            {/* 검색창 */}
            <div className="flex gap-2">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#EE4B6F]">
                <option>회원 번호</option>
                <option>이메일</option>
                <option>닉네임</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력해주세요"
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-64 outline-none focus:border-[#EE4B6F] transition-colors"
              />
              <button className="bg-[#EE4B6F] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#d63a5c] transition-colors shadow-sm">
                검색
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQna;
