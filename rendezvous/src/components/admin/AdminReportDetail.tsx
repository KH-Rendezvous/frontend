import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const AdminReportDetail = () => {
  const { id } = useParams(); // URL의 id (예: "1")
  const navigate = useNavigate();
  const location = useLocation();
  const [modal, setModal] = useState(false);

  // Link에서 보낸 state 데이터를 꺼냄 (없을 수도 있으니 안전하게 ?. 사용)
  const user = location.state?.user;

  // 만약 URL로 직접 접속해서 데이터가 없다면? (예외 처리)
  if (!user) {
    return <div className="p-10">데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <>
      {modal ? (
        <div>
          <div className="bg-black/60 fixed w-screen h-screen inset-0 z-50 flex justify-center items-center">
            <div className="w-[700px] h-[500px] bg-white rounded-2xl flex flex-col  items-center p-10">
              <div className="flex flex-col">
                <div>
                  <h2 className="text-4xl text-center font-bold mb-10">
                    신고처리
                  </h2>
                  <p className="text-2xl text-gray-400 text-center">
                    신고처리 버튼을 누르면 신고 대상의
                  </p>
                  <p className="text-2xl text-gray-400 text-center">
                    계정이 즉시 탈퇴 처리됩니다.
                  </p>
                </div>
                <div className="flex justify-center gap-5">
                  <button className="bg-[#EE4B6F] text-white px-5 py-3 rounded-2xl font-bold hover:cursor-pointer">
                    신고 처리
                  </button>
                  <button
                    className="bg-gray-400 text-black px-5 py-3 rounded-2xl font-bold hover:cursor-pointer"
                    onClick={() => setModal(false)}
                  >
                    신고 취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="w-full h-full px-10 py-10 flex flex-col items-center">
        <div className="w-full max-w-[1000px] bg-white shadow-sm rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">신고 내역 상세</h2>
          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex">
                <span className="w-24 font-bold text-gray-500">신고유형</span>
                <span>욕설/인신공격</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold text-gray-500">신고일자</span>
                <span>2025-12-07</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold text-gray-500">신고자</span>
                <span>{user.nickname}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold text-gray-500">신고 대상</span>
                <span>안재훈</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold text-gray-500">이메일</span>
                <span>jaehun4086@naver.com</span>
              </div>
            </div>
            <div className="flex mt-5">
              <span className="w-24 font-bold text-gray-500">세부 내용</span>
              <span className="w-full">{user.content}</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold">증거자료</h1>
          </div>
          <div className="flex items-center justify-center mt-20 gap-5">
            <button
              className="bg-[#EE4B6F] px-5 py-3 rounded-2xl text-white font-bold hover:cursor-pointer hover:bg-[#D63A5C] "
              onClick={() => setModal(true)}
            >
              신고 처리
            </button>
            <button
              className="bg-gray-200 px-5 py-3 rounded-2xl text-black 
            hover:cursor-pointer font-bold hover:bg-gray-400"
              onClick={() => navigate(-1)}
            >
              목록
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminReportDetail;
