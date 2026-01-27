import React, { useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import EmailStatus from "./EmailStatus";

const AdminUserManagement = () => {
  // 더미 데이터 생성
  const allUsers = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    email: `jaehun4086@naver.com`,
    nickname: `닉네임${i + 1}`,
    date: "2025-12-07",
    status: i % 3 === 0 ? "미승인" : "승인",
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [selectType, setSelectType] = useState("전체 회원");
  const itemsPerPage = 10;
  const pageGroupSize = 10;

  // 필터링 로직
  const filteredUser = allUsers.filter((user) => {
    if (selectType === "전체 회원") return true;
    if (selectType === "승인 전 회원") return user.status === "미승인";
    if (selectType === "승인 회원") return user.status === "승인";
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

  // 모달 및 상태 관리
  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [emailStatus, setEmailStatus] = useState(false);

  const modalHandler = (user) => {
    setSelectedUser(user);
    setModal(true);
  };

  const approveHandler = async () => {
    setEmailStatus(true); // 로딩/전송 상태 표시
    setModal(false); // 모달 닫기
    try {
      const resp = await axiosApi.post("/email/approve", {
        email: "jaehun4086@naver.com", // 실제로는 selectedUser.email 등을 사용
      });
      if (resp.status === 200) {
        alert("승인이 완료되었습니다.");
        setEmailStatus(false);
      }
    } catch (error) {
      console.log(error);
      setEmailStatus(false);
      alert("승인 실패");
    }
  };

  return (
    <div className="w-full h-full px-10 py-10 flex flex-col justify-center items-center">
      {emailStatus ? <EmailStatus /> : null}

      {/* ---------------- 모달 영역 시작 ---------------- */}
      {modal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          {/* 배경 (블러 처리 및 어둡게) */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModal(false)}
          ></div>

          {/* 모달 박스 */}
          <div className="relative bg-white w-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            {/* 상단 헤더 */}
            <div className="bg-[#EE4B6F] p-6">
              <h2 className="text-2xl font-bold text-white text-center">
                가입 승인 확인
              </h2>
            </div>

            {/* 컨텐츠 영역 */}
            <div className="p-8 flex flex-col gap-6 text-center">
              <div>
                <p className="text-xl text-gray-800 leading-relaxed">
                  <span className="font-bold text-[#EE4B6F] text-2xl">
                    '{selectedUser.nickname}'
                  </span>
                  님의 가입 신청을
                  <br />
                  최종 승인하시겠습니까?
                </p>
              </div>

              {/* 안내 박스 */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-500 leading-relaxed">
                <p>
                  승인 처리 시 해당 회원의 계정이{" "}
                  <span className="font-bold text-gray-700">'활성'</span> 상태로
                  전환되며,
                </p>
                <p>가입 완료 안내 이메일이 자동 발송됩니다.</p>
              </div>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-4">
              <button
                className="bg-[#EE4B6F] hover:bg-[#d63a5c] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                onClick={approveHandler}
              >
                승인하기
              </button>
              <button
                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold transition-all"
                onClick={() => setModal(false)}
              >
                취소
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
            <option>전체 회원</option>
            <option>승인 전 회원</option>
            <option>승인 회원</option>
          </select>
        </div>

        {/* 테이블 섹션 */}
        <div className="w-full overflow-x-auto mb-8 bg-white shadow-sm rounded-lg border border-gray-100">
          <table className="w-full table-fixed text-center border-collapse">
            <thead className="bg-[#fff0f3] text-gray-700 h-12 border-b-2 border-[#EE4B6F]">
              <tr>
                <th className="w-[10%] py-3 font-bold">번호</th>
                <th className="w-[30%] py-3 font-bold">이메일</th>
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
                    <td className="truncate px-2">{user.email}</td>
                    <td className="truncate px-2">{user.nickname}</td>
                    <td className="truncate px-2">{user.date}</td>
                    <td className="truncate px-2 font-medium">
                      {user.status === "미승인" ? (
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
                          미승인
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">
                          승인
                        </span>
                      )}
                    </td>
                    <td className="px-2">
                      {user.status === "미승인" && (
                        <button
                          className="bg-[#EE4B6F] hover:bg-[#d63a5c] text-white px-3 py-1 rounded text-xs font-bold shadow-sm transition-all"
                          onClick={() => {
                            modalHandler(user);
                          }}
                        >
                          승인
                        </button>
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

export default AdminUserManagement;
