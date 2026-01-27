import React, { useState } from "react";

const QnaModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 모달 닫힐 때 입력값 초기화 하고 싶으면 여기서 처리
  const handleClose = () => {
    setTitle("");
    setContent("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 배경: 블러 처리 + 어둡게 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* 모달 본체 */}
      <div className="relative w-[90%] max-w-[500px] bg-white rounded-3xl p-8 shadow-2xl transform transition-all animate-fadeInUp overflow-hidden">
        {/* 상단 장식용 그라데이션 바 */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400" />

        {/* 헤더 */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
              QnA 문의
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              궁금한 점을 남겨주시면 빠르게 답변 드릴게요.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {/* 닫기 아이콘 SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 입력 폼 */}
        <div className="space-y-6">
          {/* 제목 입력 */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
              제목
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 group-focus-within:text-rose-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all duration-200"
              />
            </div>
          </div>

          {/* 내용 입력 */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
              문의 내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상세한 내용을 적어주시면 정확한 답변에 도움이 됩니다."
              rows="5"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all duration-200 resize-none"
            ></textarea>
            {/* 글자수 카운터 (옵션) */}
            <div className="text-right text-xs text-gray-400 mt-1">
              {content.length} / 1000
            </div>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="flex items-start gap-2 mt-6 p-4 bg-rose-50 rounded-lg">
          <svg
            className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs text-gray-600 leading-relaxed">
            문의하신 내용은 담당자 확인 후 <strong>24시간 이내</strong>에
            가입하신 이메일로 답변이 전송됩니다.
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-3.5 px-6 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button className="flex-[2] py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
            문의 등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default QnaModal;
