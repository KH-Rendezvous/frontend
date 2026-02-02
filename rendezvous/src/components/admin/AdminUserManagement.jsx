import React, { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import EmailStatus from "./EmailStatus";
import { ChevronDown, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const AdminUserManagement = () => {
  // =========================================================
  // [핵심] 백엔드 서버 주소 (이미지 로딩용)
  // 프록시 없이, 이미지 태그에 http://localhost:80/... 을 직접 넣습니다.
  // =========================================================
  const BACKEND_URL = "http://localhost";

  // --- 1. 상태 관리 ---
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectType, setSelectType] = useState("all");

  const itemsPerPage = 10;
  const pageGroupSize = 10;

  // --- 2. 데이터 불러오기 ---
  const getUserData = async () => {
    try {
      // API 요청은 axios 설정(프록시 혹은 baseURL)을 따름
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

  // =========================================================
  // [이미지 주소 생성 함수]
  // 결과값 예시: "http://localhost:80/images/2026...png"
  // =========================================================
  const getUserPhotos = (user) => {
    // 1. 프로필 리스트가 있는 경우
    if (user.profileList && user.profileList.length > 0) {
      const validPhotos = user.profileList.filter(
        (img) => img.renameName || img.photoUrl
      );

      // 유효한 사진이 없으면 React public 폴더의 기본 이미지 사용
      if (validPhotos.length === 0) return ["/images/user.png"];

      return validPhotos.map((img) => {
        const urlPart = img.photoUrl || "/images/";
        const namePart = img.renameName || "";

        // [중복 방지] 더미 데이터처럼 URL에 이미 파일명이 포함된 경우
        // 예: url="/images/man1.jpg", name="man1.jpg"
        if (namePart && urlPart.includes(namePart)) {
          return `${BACKEND_URL}${urlPart}`;
        }

        // [정상] 경로 + 파일명 앞에 도메인 붙이기
        console.log(`백작업 이미지 : ${BACKEND_URL}${urlPart}${namePart}`);
        return `${BACKEND_URL}${urlPart}${namePart}`;
      });
    }

    // 2. 리스트 없고 대표 이미지만 있는 경우
    if (user.profileImage) {
      // profileImage가 "/images/..." 로 시작한다고 가정하고 앞에 도메인을 붙임
      return [`${BACKEND_URL}${user.profileImage}`];
    }

    // 3. 아무것도 없으면 기본 이미지
    return ["/images/user.png"];
  };

  // 선택된 유저의 사진 목록 계산
  const userPhotos = getUserPhotos(selectedUser);

  console.log(`userPhotos : ${userPhotos}`);
  // 프로필 모달 핸들러
  const profileModalHandler = (user) => {
    setSelectedUser(user);
    setImgIndex(0);
    setProfileModal(true);
  };

  // 상태 변경 모달 핸들러
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
    <div className="w-full h-full px-10 py-10 flex flex-col justify-center items-center font-sans">
      {emailStatus && <EmailStatus text={"메일 전송 중..."} />}

      {/* --- 프로필 상세 모달 --- */}
      {profileModal && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setProfileModal(false)}
          ></div>

          <div className="relative bg-white w-[600px] h-[800px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            {/* 1. 상단 이미지 영역 */}
            <div className="relative h-[50%] bg-gray-200">
              <img
                src={userPhotos[imgIndex]}
                alt="Profile"
                className="w-full h-full object-cover"
              />

              {userPhotos.length > 1 && (
                <div className="absolute top-3 inset-x-4 flex gap-1 z-20">
                  {userPhotos.map((item, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i === imgIndex ? "bg-white" : "bg-white/30"
                      }`}
                    ></div>
                  ))}
                </div>
              )}

              {userPhotos.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    onClick={() => setImgIndex((prev) => Math.max(0, prev - 1))}
                  >
                    <ChevronLeft size={30} />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    onClick={() =>
                      setImgIndex((prev) =>
                        Math.min(userPhotos.length - 1, prev + 1)
                      )
                    }
                  >
                    <ChevronRight size={30} />
                  </button>
                </>
              )}

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <h2 className="text-2xl font-black">
                  {selectedUser.nickname}
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

            {/* 2. 하단 상세 정보 영역 */}
            <div className="flex-1 overflow-y-auto bg-white p-6 relative">
              <div className="space-y-6 pb-4">
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
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedUser.intro || "자기소개가 없습니다."}
                  </p>
                </section>

                <section>
                  <h4 className="text-gray-900 font-bold mb-3 text-sm">
                    나에 대한 정보
                  </h4>
                  <div className="space-y-3">
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
                        className="flex justify-between items-center text-sm border-b border-gray-50 pb-2"
                      >
                        <span className="text-gray-500 flex items-center gap-2 text-xs">
                          {item.icon} {item.label}
                        </span>
                        <span className="font-semibold text-gray-800 text-xs">
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
                        {/* 관심사는 배열이므로 map으로 바로 출력 */}
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

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
              <button
                className={`flex-1 py-3 rounded-xl font-bold text-white shadow-sm text-sm transition-all cursor-pointer ${
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
        <div className="fixed inset-0 z-[100] flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setStatusModal(false)}
          ></div>
          <div className="relative bg-white w-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            <div
              className={`py-6 ${
                isApprovingTarget ? "bg-[#EE4B6F]" : "bg-gray-600"
              }`}
            >
              <h2 className="text-2xl font-bold text-white text-center">
                {isApprovingTarget ? "가입 승인 확인" : "계정 비활성 확인"}
              </h2>
            </div>
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
                  님의 상태를 <br />
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
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-4">
              <button
                className={`text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer ${
                  isApprovingTarget
                    ? "bg-[#EE4B6F] hover:bg-[#d63a5c]"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
                onClick={submitStatusHandler}
              >
                {isApprovingTarget ? "승인하기" : "비활성하기"}
              </button>
              <button
                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold transition-all cursor-pointer"
                onClick={() => setStatusModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 메인 테이블 --- */}
      <div className="w-full max-w-[1000px]">
        <div className="mb-4 flex justify-end">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none shadow-sm focus:border-[#EE4B6F] transition-colors cursor-pointer"
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

        <div className="w-full overflow-hidden bg-white shadow-sm rounded-lg border border-gray-100">
          <table className="w-full table-fixed text-center border-collapse">
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
                    <td>{formatDate(user.createDate)}</td>
                    <td>
                      <button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 px-3 py-1 rounded text-xs font-bold transition-all shadow-sm cursor-pointer"
                        onClick={() => profileModalHandler(user)}
                      >
                        조회
                      </button>
                    </td>
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
                        className={`px-3 py-1 rounded text-xs font-bold shadow-sm transition-all text-white cursor-pointer ${
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
                  <td colSpan="7" className="py-10 text-gray-400">
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
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
