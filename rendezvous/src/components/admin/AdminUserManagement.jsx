import React, { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import EmailStatus from "./EmailStatus";
import {
  ChevronDown,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const AdminUserManagement = () => {
  // [핵심] 백엔드 서버 주소
  const BACKEND_URL = "http://localhost:80";

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

  // --- 날짜 변환 함수 ---
  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    if (typeof dateValue === "string" && dateValue.includes("-")) {
      return dateValue.split(" ")[0];
    }
    const date = new Date(Number(dateValue));
    if (isNaN(date.getTime())) return dateValue;
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
    if (selectType === "unanswered") return status === "N";
    if (selectType === "answered") return status === "Y";
    return true;
  });

  // --- 4. 페이지네이션 ---
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
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  // --- 5. 모달 및 상태 변경 처리 ---
  const [statusModal, setStatusModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [emailStatus, setEmailStatus] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  // --- 이미지 주소 생성 함수 ---
  const getUserPhotos = (user) => {
    if (user.profileList && user.profileList.length > 0) {
      const validPhotos = user.profileList.filter(
        (img) => img.renameName || img.photoUrl
      );

      if (validPhotos.length === 0) return ["/images/user.png"];

      return validPhotos.map((img) => {
        const urlPart = img.photoUrl || "/images/";
        const namePart = img.renameName || "";
        if (namePart && urlPart.includes(namePart)) {
          return `${BACKEND_URL}${urlPart}`;
        }
        return `${BACKEND_URL}${urlPart}${namePart}`;
      });
    }
    if (user.profileImage) {
      return [`${BACKEND_URL}${user.profileImage}`];
    }
    return ["/images/user.png"];
  };

  const userPhotos = getUserPhotos(selectedUser);

  // 모달 핸들러들
  const profileModalHandler = (user) => {
    setSelectedUser(user);
    setImgIndex(0);
    setProfileModal(true);
  };

  const statusModalHandler = (user) => {
    setSelectedUser(user);
    setStatusModal(true);
  };

  // 상태 변경 API 호출
  const submitStatusHandler = async () => {
    const isApproving = selectedUser.memberStatus === "N";
    const actionText = isApproving ? "승인" : "비활성";
    setStatusModal(false);
    if (isApproving) setEmailStatus(true);

    try {
      const resp = await axiosApi.post("/admin/status", {
        memberNo: selectedUser.memberNo,
        email: selectedUser.email,
        nickname: selectedUser.nickname,
        memberStatus: selectedUser.memberStatus,
      });

      if (resp.status === 200 || resp.data > 0) {
        if (isApproving) setEmailStatus(false);
        setTimeout(() => {
          alert(`${actionText} 처리가 완료되었습니다.`);
          getUserData();
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
    <div className="w-full flex flex-col font-sans max-w-[1200px] mx-auto">
      {emailStatus && <EmailStatus text={"메일 전송 중..."} />}

      {/* --- 프로필 상세 모달 --- */}
      {profileModal && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setProfileModal(false)}
          ></div>

          <div className="relative bg-white w-[90%] max-w-[600px] h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            {/* 상단 이미지 영역 */}
            <div className="relative h-[45%] bg-gray-200 shrink-0">
              <img
                src={userPhotos[imgIndex]}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/images/user.png";
                }}
              />
              <button
                className="absolute top-4 right-4 z-30 p-2 bg-black/20 cursor-pointer hover:bg-black/40 rounded-full text-white transition-colors"
                onClick={() => setProfileModal(false)}
              >
                <X size={24} />
              </button>

              {userPhotos.length > 1 && (
                <>
                  <div className="absolute top-3 inset-x-4 flex gap-1 z-20 justify-center">
                    {userPhotos.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 w-full max-w-[40px] rounded-full transition-all ${
                          i === imgIndex ? "bg-white" : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
                    onClick={() => setImgIndex((prev) => Math.max(0, prev - 1))}
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
                    onClick={() =>
                      setImgIndex((prev) =>
                        Math.min(userPhotos.length - 1, prev + 1)
                      )
                    }
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h2 className="text-2xl font-black">
                  {selectedUser.nickname}{" "}
                  {selectedUser.age && `, ${selectedUser.age}`}
                </h2>
                <p className="text-sm flex items-center gap-1 mt-1 opacity-90">
                  <MapPin size={14} />{" "}
                  {selectedUser.fullAddr ||
                    selectedUser.residence ||
                    "지역 정보 없음"}
                </p>
              </div>
            </div>

            {/* 하단 상세 정보 영역 */}
            <div className="flex-1 overflow-y-auto bg-white p-6 pb-20">
              <div className="space-y-6">
                <section>
                  <h4 className="text-gray-900 font-bold mb-2 text-sm">
                    내가 찾는 관계
                  </h4>
                  <div className="bg-pink-50/50 p-3 rounded-xl border border-pink-100 flex items-center gap-2">
                    <span className="text-xl">🌹</span>
                    <span className="font-bold text-pink-600 text-sm">
                      {selectedUser.relationship || "정보 없음"}
                    </span>
                  </div>
                </section>

                <section>
                  <h4 className="text-gray-900 font-bold mb-1 text-sm">
                    자기소개
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {selectedUser.intro || "자기소개가 없습니다."}
                  </p>
                </section>

                <section>
                  <h4 className="text-gray-900 font-bold mb-3 text-sm">
                    나에 대한 정보
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        label: "직업/학교",
                        val: selectedUser.schoolName,
                        icon: "🎓",
                      },
                      {
                        label: "생년월일",
                        val: formatDate(selectedUser.birthDate),
                        icon: "🎂",
                      },
                      {
                        label: "키",
                        val: selectedUser.height
                          ? selectedUser.height + " cm"
                          : null,
                        icon: "📏",
                      },
                      { label: "MBTI", val: selectedUser.mbti, icon: "📄" },
                      {
                        label: "성별",
                        val: selectedUser.gender === "M" ? "남성" : "여성",
                        icon: "👤",
                      },
                      { label: "이메일", val: selectedUser.email, icon: "📧" },
                      {
                        label: "애정표현",
                        val: selectedUser.affection,
                        icon: "💕",
                      },
                      {
                        label: "연락스타일",
                        val: selectedUser.contact,
                        icon: "📱",
                      },
                      { label: "별자리", val: selectedUser.zodiac, icon: "✨" },
                      { label: "운동", val: selectedUser.exercise, icon: "💪" },
                      { label: "음주", val: selectedUser.drinking, icon: "🍺" },
                      { label: "SNS", val: selectedUser.social, icon: "🌐" },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 p-2"
                      >
                        <span className="text-gray-500 flex items-center gap-2 text-xs">
                          {item.icon} {item.label}
                        </span>
                        <span className="font-semibold text-gray-800 text-xs truncate max-w-[120px]">
                          {item.val || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {selectedUser.interestList &&
                  selectedUser.interestList.length > 0 && (
                    <section>
                      <h4 className="text-gray-900 font-bold mb-2 text-sm">
                        관심사
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.interestList.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-50 rounded-full text-xs font-bold text-gray-600 border border-gray-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-4 border-t border-gray-100 bg-white flex gap-2">
              <button
                className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-sm text-sm transition-all cursor-pointer ${
                  selectedUser.memberStatus === "N"
                    ? "bg-[#EE4B6F] hover:bg-[#d63a5c]"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
                onClick={() => {
                  setProfileModal(false);
                  statusModalHandler(selectedUser);
                }}
              >
                {selectedUser.memberStatus === "N"
                  ? "가입 승인하기"
                  : "계정 비활성화"}
              </button>
              <button
                className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
                onClick={() => setProfileModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 상태 변경 확인 모달 --- */}
      {statusModal && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setStatusModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-[400px] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fadeInUp">
            <div
              className={`py-6 ${
                isApprovingTarget ? "bg-[#EE4B6F]" : "bg-gray-600"
              }`}
            >
              <h2 className="text-xl font-bold text-white text-center">
                {isApprovingTarget ? "가입 승인 확인" : "계정 비활성 확인"}
              </h2>
            </div>
            <div className="p-8 flex flex-col gap-6 text-center">
              <p className="text-xl text-gray-800 leading-relaxed">
                <span
                  className={`font-bold text-2xl ${
                    isApprovingTarget ? "text-[#EE4B6F]" : "text-gray-600"
                  }`}
                >
                  '{selectedUser.nickname}'
                </span>{" "}
                님의 상태를 <br />
                <span className="font-bold">
                  {isApprovingTarget ? "최종 승인" : "비활성(정지)"}
                </span>{" "}
                하시겠습니까?
              </p>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-4">
              <button
                className={`text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all ${
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
                onClick={() => setStatusModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 상단 헤더 & 필터 --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          회원 관리
        </h1>
        <select
          className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none shadow-sm focus:border-[#EE4B6F] transition-colors cursor-pointer"
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

      {/* ================================================================= */}
      {/* [1] 모바일용 카드 리스트 뷰 (md:hidden) */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 gap-4 md:hidden w-full mb-6">
        {currentItems.length > 0 ? (
          currentItems.map((user) => (
            <div
              key={user.memberNo}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {user.nickname}
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                      No.{user.memberNo}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    user.memberStatus === "N"
                      ? "bg-gray-100 text-gray-500 border border-gray-200"
                      : "bg-green-50 text-green-600 border border-green-100"
                  }`}
                >
                  {user.memberStatus === "N" ? "미승인" : "승인"}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-50 pt-3">
                <span>가입일</span>
                <span className="font-medium">
                  {formatDate(user.createDate)}
                </span>
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  className="flex-1 bg-white border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                  onClick={() => profileModalHandler(user)}
                >
                  프로필 조회
                </button>
                <button
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-colors ${
                    user.memberStatus === "N"
                      ? "bg-[#EE4B6F] hover:bg-[#d63a5c]"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                  onClick={() => statusModalHandler(user)}
                >
                  {user.memberStatus === "N" ? "승인하기" : "비활성"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            데이터가 없습니다.
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* [2] 데스크탑용 테이블 뷰 (hidden md:block) */}
      {/* ================================================================= */}
      <div className="hidden md:block w-full overflow-hidden bg-white shadow-sm rounded-lg border border-gray-100 mb-6">
        <table className="w-full text-center border-collapse">
          <thead className="bg-[#fff0f3] text-gray-700 h-12 border-b-2 border-[#EE4B6F]">
            <tr>
              <th className="w-[10%] py-3 font-bold">번호</th>
              <th className="w-[30%] py-3 font-bold">이메일</th>
              <th className="w-[20%] py-3 font-bold">닉네임</th>
              <th className="w-[20%] py-3 font-bold">가입일</th>
              <th className="w-[10%] py-3 font-bold">프로필</th>
              <th className="w-[10%] py-3 font-bold">상태</th>
              <th className="w-[10%] py-3 font-bold">관리</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
            {currentItems.length > 0 ? (
              currentItems.map((user) => (
                <tr
                  key={user.memberNo}
                  className="hover:bg-gray-50 h-14 transition-colors"
                >
                  <td>{user.memberNo}</td>
                  <td className="truncate px-2">{user.email}</td>
                  <td className="truncate px-2">{user.nickname}</td>
                  <td>{formatDate(user.createDate)}</td>
                  <td>
                    <button
                      className="bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded text-xs font-bold hover:bg-gray-50 transition-all cursor-pointer"
                      onClick={() => profileModalHandler(user)}
                    >
                      조회
                    </button>
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        user.memberStatus === "N"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {user.memberStatus === "N" ? "미승인" : "승인"}
                    </span>
                  </td>
                  <td className="px-2">
                    <button
                      className={`px-3 py-1 rounded text-xs font-bold shadow-sm transition-all text-white cursor-pointer w-[70px] ${
                        user.memberStatus === "N"
                          ? "bg-[#EE4B6F] hover:bg-[#d63a5c]"
                          : "bg-gray-400 hover:bg-gray-500"
                      }`}
                      onClick={() => statusModalHandler(user)}
                    >
                      {user.memberStatus === "N" ? "승인" : "비활성"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-20 text-gray-400">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- 페이지네이션 --- */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-2 pb-10 mt-auto">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all"
          >
            &lt;&lt;
          </button>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all"
          >
            &lt;
          </button>
          <div className="flex gap-1">
            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                  currentPage === n
                    ? "bg-[#EE4B6F] text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-100"
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
            &gt;
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all"
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
