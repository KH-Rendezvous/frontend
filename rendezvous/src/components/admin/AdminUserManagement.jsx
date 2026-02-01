import React, { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import EmailStatus from "./EmailStatus";

const AdminUserManagement = () => {
  // --- 1. 상태 관리 ---
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectType, setSelectType] = useState("all");

  const itemsPerPage = 10;
  const pageGroupSize = 10;

  // --- 2. 데이터 불러오기 ---
  const getUserData = async () => {
    try {
      const resp = await axiosApi.get("/admin/members");
      setUserList(resp.data);
    } catch (error) {
      console.error("회원 목록 로딩 실패:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // --- [추가] 날짜 변환 함수 ---
  // DB에서 넘어온 타임스탬프(숫자)를 "YYYY-MM-DD" 문자열로 변환
  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    // 1. 만약 이미 "2026-02-01" 같은 문자열 형식이면 그대로 반환
    if (typeof dateValue === "string" && dateValue.includes("-"))
      return dateValue;

    // 2. 숫자(타임스탬프)라면 Date 객체로 변환
    const date = new Date(Number(dateValue));
    if (isNaN(date.getTime())) return dateValue; // 변환 실패 시 원본 반환

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // --- 3. 필터링 로직 ---
  const filteredUser = userList.filter((user) => {
    const status = user.memberStatus
      ? user.memberStatus.trim().toUpperCase()
      : "N";

    if (selectType === "all") return true;
    if (selectType === "unanswered") return status === "N"; // 미승인
    if (selectType === "answered") return status === "Y"; // 승인
    return true;
  });

  // --- 4. 페이지네이션 (그룹 로직) ---
  const totalItems = filteredUser.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const currentItems = filteredUser.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // --- 5. 모달 및 상태 변경 처리 ---
  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [emailStatus, setEmailStatus] = useState(false);

  // 버튼 클릭 -> 모달 열기
  const modalHandler = (user) => {
    setSelectedUser(user);
    setModal(true);
  };

  // 모달 [확인] 클릭 -> 로딩 -> API 호출 -> 결과 알림
  const submitStatusHandler = async () => {
    const isApproving = selectedUser.memberStatus === "N";
    const actionText = isApproving ? "승인" : "비활성";

    // 1. 모달 먼저 닫기 (화면 겹침 방지)
    setModal(false);

    // 2. 승인일 때만 '메일 전송 중' 로딩 표시
    if (isApproving) setEmailStatus(true);

    try {
      const resp = await axiosApi.post("/admin/status", {
        memberNo: selectedUser.memberNo,
        email: selectedUser.email,
        nickname: selectedUser.nickname,
        memberStatus: selectedUser.memberStatus,
      });

      if (resp.status === 200 || resp.data > 0) {
        // 3. 성공 시 로딩 끄기
        if (isApproving) setEmailStatus(false);

        // 4. 로딩창이 사라진 뒤 Alert 표시 (자연스러운 전환)
        setTimeout(() => {
          alert(`${actionText} 처리가 완료되었습니다.`);
          getUserData(); // 목록 새로고침
        }, 100);
      }
    } catch (error) {
      console.log(error);
      if (isApproving) setEmailStatus(false);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const isApprovingTarget = selectedUser.memberStatus === "N";

  return (
    <div className="w-full h-full px-10 py-10 flex flex-col justify-center items-center font-sans">
      {/* 로딩 화면 (조건부 렌더링) */}
      {emailStatus && <EmailStatus />}

      {/* --- 모달 영역 --- */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModal(false)}
          ></div>
          <div className="relative bg-white w-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            {/* 헤더 */}
            <div
              className={`py-6 ${
                isApprovingTarget ? "bg-[#EE4B6F]" : "bg-gray-600"
              }`}
            >
              <h2 className="text-2xl font-bold text-white text-center">
                {isApprovingTarget ? "가입 승인 확인" : "계정 비활성 확인"}
              </h2>
            </div>

            {/* 내용 */}
            <div className="p-8 flex flex-col gap-6 text-center">
              <div>
                <p className="text-xl text-gray-800 leading-relaxed">
                  <span
                    className={`font-bold text-2xl ${
                      isApprovingTarget ? "text-[#EE4B6F]" : "text-gray-600"
                    }`}
                  >
                    '{selectedUser.nickname}'
                  </span>
                  님의 상태를
                  <br />
                  <span className="font-bold">
                    {isApprovingTarget ? "최종 승인" : "비활성(정지)"}
                  </span>
                  하시겠습니까?
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-500 leading-relaxed">
                {isApprovingTarget ? (
                  <>
                    <p>
                      승인 처리 시 해당 회원의 계정이{" "}
                      <span className="font-bold text-gray-700">'활성'</span>{" "}
                      상태로 전환되며,
                    </p>
                    <p>가입 완료 안내 이메일이 자동 발송됩니다.</p>
                  </>
                ) : (
                  <>
                    <p>
                      비활성 처리 시 해당 회원은{" "}
                      <span className="font-bold text-red-500">
                        '로그인 불가'
                      </span>{" "}
                      상태가 됩니다.
                    </p>
                    <p>부정 가입이나 신고 누적 시 사용하는 기능입니다.</p>
                  </>
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-4">
              <button
                className={`text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5
                  ${
                    isApprovingTarget
                      ? "bg-[#EE4B6F] hover:bg-[#d63a5c]"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                onClick={submitStatusHandler}
              >
                {isApprovingTarget ? "승인하기" : "비활성하기"}
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

      {/* --- 메인 리스트 --- */}
      <div className="w-full max-w-[1000px]">
        {/* 필터 */}
        <div className="mb-4 flex justify-end">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none shadow-sm focus:border-[#EE4B6F] transition-colors"
            value={selectType}
            onChange={(e) => {
              setSelectType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">전체 회원</option>
            <option value="unanswered">승인 전 회원</option>
            <option value="answered">승인 회원</option>
          </select>
        </div>

        {/* 테이블 */}
        <div className="w-full overflow-hidden bg-white shadow-sm rounded-lg border border-gray-100">
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
                    key={user.memberNo}
                    className="border-b border-gray-100 hover:bg-gray-50 h-12 transition-colors"
                  >
                    <td>{user.memberNo}</td>
                    <td className="truncate px-2">{user.email}</td>
                    <td className="truncate px-2">{user.nickname}</td>

                    {/* [수정] 날짜 변환 함수 적용 부분 */}
                    <td>{formatDate(user.createDate)}</td>

                    <td>
                      {user.memberStatus === "N" ? (
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                          미승인
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">
                          승인
                        </span>
                      )}
                    </td>
                    <td className="px-2">
                      <button
                        className={`px-3 py-1 rounded text-xs font-bold shadow-sm transition-all text-white
                          ${
                            user.memberStatus === "N"
                              ? "bg-[#EE4B6F] hover:bg-[#d63a5c]"
                              : "bg-gray-400 hover:bg-gray-500"
                          }`}
                        onClick={() => modalHandler(user)}
                      >
                        {user.memberStatus === "N" ? "승인" : "비활성"}
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

        {/* --- 페이지네이션 --- */}
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

export default AdminUserManagement;
