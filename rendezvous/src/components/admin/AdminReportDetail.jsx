import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  X,
  User,
  AlertTriangle,
  Calendar,
  Mail,
  ChevronLeft,
} from "lucide-react";
import React from "react";
import { axiosApi } from "../../api/axiosAPI";

const AdminReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [modal, setModal] = useState(false);

  // [이미지 확대] 상태 관리
  const [zoomImage, setZoomImage] = useState(null);

  const user = location.state?.user;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 min-h-[60vh]">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
          <AlertTriangle className="text-gray-400" size={32} />
        </div>
        <p className="text-gray-500 font-bold text-lg">
          데이터를 찾을 수 없습니다.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#EE4B6F] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#d63a5c] transition-all"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const handleProcessReport = () => {
    alert("신고 처리가 완료되었습니다. (계정 정지/탈퇴)");
    setModal(false);
    navigate("/admin/report");
  };

  return (
    <div className="w-full flex flex-col font-sans max-w-4xl mx-auto pb-20">
      {/* [이미지 확대 모달] */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[60] flex justify-center items-center bg-black/90 backdrop-blur-md animate-fadeIn p-4"
          onClick={() => setZoomImage(null)}
        >
          <button
            className="absolute top-5 right-5 text-white hover:text-gray-300 p-2"
            onClick={() => setZoomImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={zoomImage}
            alt="Enlarged"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* [신고 처리 확인 모달] */}
      {modal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-[400px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            <div className="bg-[#EE4B6F] p-5">
              <h2 className="text-xl font-bold text-white text-center">
                신고 처리 확인
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-4 text-center">
              <p className="text-lg font-bold text-gray-800 leading-relaxed">
                해당 사용자를
                <br />
                신고 처리하시겠습니까?
              </p>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-sm text-red-600 text-left">
                <p className="font-bold mb-2 flex items-center gap-1">
                  <AlertTriangle size={16} /> 주의사항
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>
                    대상의 계정이 <strong>즉시 정지/탈퇴</strong> 처리됩니다.
                  </li>
                  <li>이 작업은 되돌릴 수 없을 수도 있습니다.</li>
                </ul>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50">
              <button
                className="flex-1 bg-[#EE4B6F] hover:bg-[#d63a5c] text-white py-3 rounded-xl font-bold shadow-sm transition-all"
                onClick={handleProcessReport}
              >
                처리 확정
              </button>
              <button
                className="flex-1 bg-white border border-gray-300 text-gray-600 py-3 rounded-xl font-bold transition-all"
                onClick={() => setModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상세 내용 본문 */}
      <div className="bg-white shadow-sm rounded-3xl p-6 md:p-10 border border-gray-100">
        {/* 헤더 */}
        <div className="border-b border-gray-100 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-all"
            >
              <ChevronLeft size={24} className="text-gray-500" />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              신고 내역 상세
            </h2>
          </div>
          <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-xs font-bold">
            No. {id}
          </span>
        </div>

        {/* 정보 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100">
            <h3 className="text-[#EE4B6F] font-bold mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={14} /> Report Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-200/60">
                <span className="text-gray-500">신고 유형</span>
                <span className="font-bold text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">
                  {user.codeName || "유형 없음"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200/60">
                <span className="text-gray-500">신고 일자</span>
                <span className="font-bold text-gray-800 flex items-center gap-1">
                  <Calendar size={14} className="text-gray-400" /> {user.date}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">신고자</span>
                <span className="font-bold text-gray-800 flex items-center gap-1">
                  <User size={14} className="text-gray-400" /> {user.nickname}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-100">
            <h3 className="text-[#EE4B6F] font-bold mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Target Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-200/60">
                <span className="text-gray-500">신고 대상</span>
                <span className="font-bold text-gray-800">
                  {user.targetNickname || "정보 없음"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200/60">
                <span className="text-gray-500">회원 번호</span>
                <span className="font-bold text-gray-800">
                  {user.targetMemberNo}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">상태</span>
                <span className="font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                  조치 필요
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 신고 내용 */}
        <div className="mb-8">
          <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2 text-lg">
            <span className="w-1.5 h-6 bg-[#EE4B6F] rounded-full block"></span>{" "}
            신고 내용
          </h3>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm min-h-[150px]">
            <p className="font-bold text-lg mb-4 text-black">{user.title}</p>
            {user.content}
          </div>
        </div>

        {/* 증거 자료 */}
        <div className="mb-12">
          <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2 text-lg">
            <span className="w-1.5 h-6 bg-[#EE4B6F] rounded-full block"></span>{" "}
            증거 자료
            <span className="text-xs font-normal text-gray-400 ml-1">
              (클릭하여 확대)
            </span>
          </h3>
          <div className="border border-gray-200 rounded-2xl p-6 bg-[#F9FAFB]">
            {user.imageList && user.imageList.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {user.imageList.map((img, i) => (
                  <div
                    key={i}
                    className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                    onClick={() =>
                      setZoomImage(`${axiosApi.defaults.baseURL}${img}`)
                    }
                  >
                    <img
                      src={`${axiosApi.defaults.baseURL}${img}`}
                      alt={`증거 ${i + 1}`}
                      className="w-[150px] h-[100px] object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-bold">
                        확대
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400 gap-2">
                <AlertTriangle size={24} className="opacity-50" />
                <p className="text-sm font-medium">첨부된 이미지가 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-8 border-t border-gray-100">
          <button
            className="w-full sm:w-auto bg-[#EE4B6F] hover:bg-[#d63a5c] text-white px-10 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            onClick={() => setModal(true)}
          >
            <span>🚨</span> 신고 처리 (제재)
          </button>
          <button
            className="w-full sm:w-auto bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 px-10 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
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
