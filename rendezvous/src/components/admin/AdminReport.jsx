import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminReport = () => {
  const allUsers = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    title: `user${i + 1} 신고합니다.`,
    nickname: `닉네임${i + 1}`,
    date: "2025-12-07",
    status: i % 3 === 0 ? "미완료" : "완료",
    content: `닉네임${
      i + 1
    } 신고해요 자꾸 이상한 이야기를 건내고 이상한 사진을 보냅니다.신고해요 자꾸 이상한 이야기를 건내고 이상한 사진을 보냅니다.신고해요 자꾸 이상한 이야기를 건내고 이상한 사진을 보냅니다.신고해요 자꾸 이상한 이야기를 건내고 이상한 사진을 보냅니다.신고해요 자꾸 이상한 이야기를 건내고 이상한 사진을 보냅니다.신고해요 자꾸 이상한 이야기를 건내고 이상한 사진을 보냅니다.신고해요 자꾸 이상한 이야기를 건내고 이상한 사진을 보냅니다.`,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const pageGroupSize = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(allUsers.length / itemsPerPage);

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

  const [selectedUser, setSelectedUser] = useState({});

  const modalHandler = (user) => {
    setSelectedUser(user);
  };
  return (
    <div className="w-full h-full px-10 py-10 flex flex-col justify-center items-center">
      <div className="w-full max-w-[1000px]">
        <div className="w-full overflow-x-auto mb-8 bg-white shadow-sm rounded-lg">
          <table className="w-full table-fixed text-center border-collapse border-t-2 border-[#F0ADBC]">
            <thead className="bg-[#F0ADBC] text-gray-800 h-12">
              <tr>
                <th className="w-[10%] py-3 whitespace-nowrap font-semibold">
                  번호
                </th>
                <th className="w-[30%] py-3 whitespace-nowrap font-semibold">
                  제목
                </th>
                <th className="w-[20%] py-3 whitespace-nowrap font-semibold">
                  닉네임
                </th>
                <th className="w-[20%] py-3 whitespace-nowrap font-semibold">
                  작성일
                </th>
                <th className="w-[10%] py-3 whitespace-nowrap font-semibold">
                  <p>프로필</p>
                  <p>상세보기</p>
                </th>
                <th className="w-[10%] py-3 whitespace-nowrap font-semibold">
                  처리 상태
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
                    <td className="truncate px-2">
                      <Link to={`/admin/report/${user.id}`} state={{ user }}>
                        {user.title}
                      </Link>
                    </td>
                    <td className="truncate px-2">{user.nickname}</td>
                    <td className="truncate px-2">{user.date}</td>
                    <td className="px-2">
                      <button
                        className="bg-[#EE4B6F] hover:bg-[#D63A5C] text-white px-3 py-1 rounded text-xs font-bold transition-colors hover:cursor-pointer"
                        onClick={() => {
                          modalHandler(user);
                        }}
                      >
                        프로필
                      </button>
                    </td>
                    <td className="truncate px-2 font-medium">
                      {user.status === "미완료" ? (
                        <span className="text-gray-500">미완료</span>
                      ) : (
                        <span className="text-black">완료</span>
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

export default AdminReport;
