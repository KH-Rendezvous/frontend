import React, { useState } from "react";

const AdminUserManagement = () => {
  const allUsers = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    email: `user${i + 1}@example.com`,
    nickname: `닉네임${i + 1}`,
    date: "2025-12-07",
    status: i % 3 === 0 ? "미승인" : "승인",
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [selectType, setSelectType] = useState("전체 회원");
  const itemsPerPage = 10;
  const pageGroupSize = 10;

  const filteredUser = allUsers.filter((user) => {
    if (selectType === "전체 회원") return true;
    if (selectType === "승인 전 회원") return user.status === "미승인";
    if (selectType === "승인 회원") return user.status === "승인";
    return true;
  });
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

  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const modalHandler = (user) => {
    setSelectedUser(user);
    setModal(user);
  };
  return (
    <div className="w-full h-full px-10 py-10 flex flex-col justify-center items-center">
      {modal ? (
        <div>
          <div className="bg-black/60 fixed w-screen h-screen inset-0 z-50 flex justify-center items-center">
            <div className="w-[700px] h-[500px] bg-white rounded-2xl flex flex-col  items-center p-10">
              <div className="flex flex-col gap-20">
                <div>
                  <p
                    className="font-bold text-[60px] text-center border-b border-gray-400
                mb-10"
                  >
                    가입 승인
                  </p>
                </div>
                <div>
                  <p className="text-[25px] font-bold">
                    '{selectedUser.nickname}'님의 가입 신청을 최종
                    승인하시겠습니까?
                  </p>
                  <p className="text-center text-gray-400">
                    '승인 처리 시 해당 회원의 계정이 '활성' 상태로 전환되며,
                  </p>
                  <p className="text-center text-gray-400">
                    가입 완료 안내 이메일이 자동 발송됩니다.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <button className="bg-[#EE4B6F] text-white font-bold px-7 py-2 rounded-2xl hover:cursor-pointer">
                    승인
                  </button>
                  <button
                    className="bg-gray-500 text-black px-7 py-2 rounded-2xl font-bold
                    hover:cursor-pointer"
                    onClick={() => setModal(false)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="w-full max-w-[1000px]">
        <div className="mb-4">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none shadow-sm"
            onChange={(e) => {
              setSelectType(e.target.value);
              setCurrentPage(1); // 필터 변경시 1페이지로
            }}
          >
            <option>전체 회원</option>
            <option>승인 전 회원</option>
            <option>승인 회원</option>
          </select>
        </div>

        {/* 테이블 섹션 */}
        <div className="w-full overflow-x-auto mb-8 bg-white shadow-sm rounded-lg">
          <table className="w-full table-fixed text-center border-collapse border-t-2 border-[#F0ADBC]">
            <thead className="bg-[#F0ADBC] text-gray-800 h-12">
              <tr>
                <th className="w-[10%] py-3 whitespace-nowrap font-semibold">
                  번호
                </th>
                <th className="w-[30%] py-3 whitespace-nowrap font-semibold">
                  이메일
                </th>
                <th className="w-[20%] py-3 whitespace-nowrap font-semibold">
                  닉네임
                </th>
                <th className="w-[20%] py-3 whitespace-nowrap font-semibold">
                  가입일
                </th>
                <th className="w-[10%] py-3 whitespace-nowrap font-semibold">
                  회원 상태
                </th>
                <th className="w-[10%] py-3 whitespace-nowrap font-semibold">
                  가입 승인
                </th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-50 h-12"
                  >
                    <td className="truncate px-2">{user.id}</td>
                    <td className="truncate px-2">{user.email}</td>
                    <td className="truncate px-2">{user.nickname}</td>
                    <td className="truncate px-2">{user.date}</td>
                    <td className="truncate px-2 font-medium">
                      {user.status === "미승인" ? (
                        <span className="text-gray-500">미승인</span>
                      ) : (
                        <span className="text-black">승인</span>
                      )}
                    </td>
                    <td className="px-2">
                      {user.status === "미승인" && (
                        <button
                          className="bg-[#EE4B6F] hover:bg-[#D63A5C] text-white px-3 py-1 rounded text-xs font-bold transition-colors hover:cursor-pointer"
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
                  <td colSpan="6" className="py-10">
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
            <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="hover:text-[#EE4B6F] disabled:opacity-30 disabled:hover:text-gray-500"
              >
                &lt;&lt;
              </button>

              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="hover:text-[#EE4B6F] disabled:opacity-30 disabled:hover:text-gray-500"
              >
                &lt;
              </button>

              <div className="flex gap-2">
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
                className="hover:text-[#EE4B6F] disabled:opacity-30 disabled:hover:text-gray-500"
              >
                &gt;
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="hover:text-[#EE4B6F] disabled:opacity-30 disabled:hover:text-gray-500"
              >
                &gt;&gt;
              </button>
            </div>

            {/* 검색창 */}
            <div className="flex gap-2">
              <select className="border border-gray-300 rounded px-2 py-2 text-sm outline-none w-24">
                <option>회원 번호</option>
                <option>이메일</option>
                <option>닉네임</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력해주세요"
                className="border border-gray-300 rounded px-3 py-2 text-sm w-64 outline-none focus:border-[#EE4B6F]"
              />
              <button className="bg-[#EE4B6F] text-white px-5 py-2 rounded text-sm font-bold hover:bg-[#D63A5C]">
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
