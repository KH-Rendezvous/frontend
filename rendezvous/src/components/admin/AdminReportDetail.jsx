import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const AdminReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [modal, setModal] = useState(false);

  // Link에서 보낸 state 데이터를 꺼냄 (없을 수도 있으니 안전하게 ?. 사용)
  const user = location.state?.user;

  // 만약 URL로 직접 접속해서 데이터가 없다면? (예외 처리)
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500 font-medium">데이터를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#EE4B6F] text-white px-6 py-2 rounded-lg font-bold"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const handleProcessReport = () => {
    // 신고 처리 로직 (API 호출 등)
    alert("신고 처리가 완료되었습니다. (계정 정지/탈퇴)");
    setModal(false);
    navigate("/admin/report"); // 처리 후 목록으로 이동
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
          <div className="relative bg-white w-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            {/* 상단 헤더 (경고 느낌의 붉은 계열 유지 or 브랜드 컬러) */}
            <div className="bg-[#EE4B6F] p-6">
              <h2 className="text-2xl font-bold text-white text-center">
                신고 처리 확인
              </h2>
            </div>

            {/* 컨텐츠 영역 */}
            <div className="p-8 flex flex-col gap-6 text-center">
              <div>
                <p className="text-xl text-gray-800 leading-relaxed font-bold">
                  해당 사용자를 신고 처리하시겠습니까?
                </p>
              </div>

              {/* 경고 박스 */}
              <div className="bg-red-50 p-5 rounded-xl border border-red-100 text-sm text-red-600 leading-relaxed text-left">
                <p className="font-bold mb-2 flex items-center gap-2">
                  ⚠️ 주의사항
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    신고 처리 버튼을 누르면 대상의 계정이{" "}
                    <strong>즉시 정지/탈퇴</strong> 처리됩니다.
                  </li>
                  <li>이 작업은 되돌릴 수 없을 수도 있습니다.</li>
                </ul>
              </div>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-4">
              <button
                className="bg-[#EE4B6F] hover:bg-[#d63a5c] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                onClick={handleProcessReport}
              >
                처리 확정
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

      <div className="w-full max-w-[1000px] bg-white shadow-md rounded-2xl p-10 border border-gray-100">
        {/* 상단 타이틀 */}
        <div className="border-b border-gray-200 pb-6 mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">신고 내역 상세</h2>
          <span className="bg-gray-100 text-gray-500 px-4 py-1 rounded-full text-sm font-bold">
            No. {id}
          </span>
        </div>

        {/* 상세 정보 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 왼쪽: 신고 정보 */}
          <div className="flex flex-col gap-6">
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-[#EE4B6F] font-bold mb-4 text-sm uppercase tracking-wider">
                Report Info
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">신고 유형</span>
                  <span className="font-bold text-gray-800">욕설/인신공격</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">신고 일자</span>
                  <span className="font-bold text-gray-800">{user.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">신고자</span>
                  <span className="font-bold text-gray-800">
                    {user.nickname}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 신고 대상 정보 */}
          <div className="flex flex-col gap-6">
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-[#EE4B6F] font-bold mb-4 text-sm uppercase tracking-wider">
                Target Info
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">신고 대상</span>
                  <span className="font-bold text-gray-800">안재훈 (임시)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">이메일</span>
                  <span className="font-bold text-gray-800">
                    jaehun4086@naver.com
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">누적 신고</span>
                  <span className="font-bold text-red-500">3회</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 신고 내용 (Full Width) */}
        <div className="mb-8">
          <h3 className="text-gray-700 font-bold mb-2 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#EE4B6F] rounded-full block"></span>
            신고 내용
          </h3>
          <div className="bg-white border border-gray-200 p-6 rounded-xl text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm min-h-[100px]">
            <p className="font-bold text-lg mb-2">{user.title}</p>
            {user.content}
          </div>
        </div>

        {/* 증거 자료 (Full Width) */}
        <div className="mb-12">
          <h3 className="text-gray-700 font-bold mb-2 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#EE4B6F] rounded-full block"></span>
            증거 자료
          </h3>
          {/* 이미지가 없을 때를 대비한 플레이스홀더 영역 */}
          <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>첨부된 이미지가 없습니다.</p>
          </div>
        </div>

        {/* 하단 버튼 액션 */}
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100">
          <button
            className="bg-[#EE4B6F] hover:bg-[#d63a5c] text-white px-10 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            onClick={() => setModal(true)}
          >
            <span>🚨</span> 신고 처리 (제재)
          </button>

          <button
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 px-10 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReportDetail;
