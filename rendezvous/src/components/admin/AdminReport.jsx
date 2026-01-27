import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminReport = () => {
  // 더미 데이터 생성
  const allUsers = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    title: `user${i + 1} 신고합니다.`,
    nickname: `닉네임${i + 1}`,
    date: "2025-12-07",
    status: i % 3 === 0 ? "미완료" : "완료",
    content: `닉네임${
      i + 1
    } 신고해요. 자꾸 이상한 이야기를 건내고 부적절한 사진을 보냅니다. 채팅방에서 지속적으로 욕설을 사용하여 불쾌감을 조성하고 있습니다. 빠른 조치 부탁드립니다.`,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [selectType, setSelectType] = useState("전체 신고");
  const itemsPerPage = 10;
  const pageGroupSize = 10;

  // 필터링 로직
  const filteredUser = allUsers.filter((user) => {
    // 실제 필터링 로직 구현 (필요에 따라 수정)
    if (selectType === "전체 신고") return true;
    if (selectType === "처리 미완료") return user.status === "미완료";
    if (selectType === "처리 완료") return user.status === "완료";
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

  // 관리자 처리 코멘트 (예시)
  const [adminComment, setAdminComment] = useState("");

  const modalHandler = (user) => {
    setSelectedUser(user);
    setModal(true);
    setAdminComment(""); // 모달 열 때 코멘트 초기화
  };

  const handleProcessReport = () => {
    // 여기에 신고 처리 API 호출 로직 추가
    alert(`신고 번호 ${selectedUser.id}번 처리가 완료되었습니다.`);
    setModal(false);
  };

  return (
    <div className="w-full h-full px-10 py-10 flex flex-col justify-center items-center">
      {/* ---------------- 모달 영역 시작 ---------------- */}
      {modal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          {/* 배경 (블러 처리 및 어둡게) */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModal(false)}
          ></div>

          {/* 모달 박스 */}
          <div className="relative bg-white w-[650px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            {/* 상단 헤더 */}
            <div className="bg-[#EE4B6F] p-6">
              <h2 className="text-2xl font-bold text-white text-center">
                신고 상세 내용
              </h2>
            </div>

            {/* 컨텐츠 영역 (스크롤 가능) */}
            <div className="p-8 overflow-y-auto flex-1 flex flex-col gap-6">
              {/* 신고 정보 요약 */}
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-bold">
                    신고 대상 / 작성자
                  </span>
                  <span className="text-gray-800 font-bold text-lg">
                    {selectedUser.nickname}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs text-gray-500 font-bold">
                    신고 일자
                  </span>
                  <span className="text-gray-600">{selectedUser.date}</span>
                </div>
              </div>

              {/* 신고 제목 및 내용 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">
                  신고 내용
                </label>
                <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm min-h-[150px]">
                  <h3 className="font-bold text-lg mb-3 pb-2 border-b border-gray-100 text-gray-800">
                    {selectedUser.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedUser.content}
                  </p>
                </div>
              </div>

              {/* 관리자 처리 코멘트 입력 (선택 사항) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">
                  관리자 처리 메모
                </label>
                <textarea
                  className="w-full h-[100px] border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20 transition-all resize-none text-sm"
                  placeholder="처리 내용을 입력하세요 (선택)"
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                />
              </div>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-4">
              <button
                className="bg-[#EE4B6F] hover:bg-[#d63a5c] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                onClick={handleProcessReport}
              >
                처리 완료
              </button>
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
            <option>전체 신고</option>
            <option>처리 미완료</option>
            <option>처리 완료</option>
          </select>
        </div>

        {/* 테이블 섹션 */}
        <div className="w-full overflow-x-auto mb-8 bg-white shadow-sm rounded-lg border border-gray-100">
          <table className="w-full table-fixed text-center border-collapse">
            <thead className="bg-[#fff0f3] text-gray-700 h-12 border-b-2 border-[#EE4B6F]">
              <tr>
                <th className="w-[10%] py-3 font-bold">번호</th>
                <th className="w-[35%] py-3 font-bold">제목</th>
                <th className="w-[15%] py-3 font-bold">닉네임</th>
                <th className="w-[15%] py-3 font-bold">작성일</th>
                <th className="w-[15%] py-3 font-bold">관리</th>
                <th className="w-[10%] py-3 font-bold">상태</th>
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

                    {/* 제목 클릭 시 상세 페이지 이동 또는 모달 열기 */}
                    <td className="truncate px-2 text-left pl-6">
                      <Link
                        to={`/admin/report/${user.id}`}
                        state={{ user }}
                        className="hover:text-[#EE4B6F] hover:underline transition-colors font-medium"
                      >
                        {user.title}
                      </Link>
                    </td>

                    <td className="truncate px-2">{user.nickname}</td>
                    <td className="truncate px-2">{user.date}</td>

                    {/* 관리 버튼들 */}
                    <td className="px-2">
                      <div className="flex justify-center gap-3">
                        {/* 모달 상세보기 버튼 */}
                        <button
                          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 w-2xs   rounded text-xs font-bold transition-all"
                          onClick={() => modalHandler(user)}
                        >
                          미리보기
                        </button>
                        {/* 프로필 이동 버튼 (예시) */}
                        <button className="bg-[#EE4B6F] hover:bg-[#d63a5c] text-white  py-2 rounded text-xs font-bold shadow-sm transition-all w-2xs">
                          프로필
                        </button>
                      </div>
                    </td>

                    {/* 처리 상태 배지 */}
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

export default AdminReport;
