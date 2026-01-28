import React, { useState, useEffect } from "react";
import axios from "axios"; // ★ axios 임포트 필수

const BlockListModal = ({ isOpen, onClose }) => {
  // 1. 초기값은 빈 배열로 시작
  const [blockList, setBlockList] = useState([]);

  // 2. 모달이 열릴 때(isOpen이 true가 될 때)마다 DB에서 목록 긁어오기
  useEffect(() => {
    if (isOpen) {
      getBlockList();
    }
  }, [isOpen]);

  // 목록 조회 함수 (수정본)
  const getBlockList = async () => {
    try {
      const response = await axios.get("/api/block/list");

      console.log("서버 응답 데이터:", response.data); // F12 콘솔 찍어봐라 뭐가 오는지

      // ★ 여기가 핵심: 데이터가 배열(Array)일 때만 넣고, 아니면 빈 배열 넣기
      if (Array.isArray(response.data)) {
        setBlockList(response.data);
      } else {
        console.warn("데이터가 배열이 아님. 로그인 풀렸거나 에러임.");
        setBlockList([]); // 빈 배열로 초기화해서 에러 방지
      }
    } catch (error) {
      console.error("차단 목록 로딩 실패:", error);
      setBlockList([]); // 에러 나도 빈 배열 넣어줘야 화면 안 깨짐
    }
  };

  // 3. 차단 해제 핸들러 (DB 삭제 요청)
  const handleUnblock = async (blockId) => {
    if (!window.confirm("정말 차단을 해제하시겠습니까?")) return;

    try {
      // 백엔드 Controller: @DeleteMapping("/api/block/delete")
      // DELETE 요청은 body를 보낼 때 { data: { ... } } 형태로 감싸야 함
      const response = await axios.delete("/api/block/delete", {
        data: { blockId: blockId },
      });

      if (response.data === "success") {
        alert("해제되었습니다.");
        // 성공하면 목록에서 바로 지워서 새로고침 효과 냄 (UI 반응 속도 UP)
        setBlockList((prev) => prev.filter((item) => item.blockId !== blockId));
      } else {
        alert("해제 실패 (로그인 세션 확인 필요)");
      }
    } catch (error) {
      console.error("차단 해제 에러:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-[400px] rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. 헤더 */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-lg text-gray-800">차단 관리</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
          >
            &times;
          </button>
        </div>

        {/* 2. 리스트 영역 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          {blockList.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 text-sm">
              <p>차단한 내역이 없습니다.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 border-b border-gray-100">
              {blockList.map((item) => (
                <li
                  key={item.blockId}
                  className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-[15px] mb-1">
                      {item.targetName || "이름 없음"}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {/* DB 컬럼값 null 체크 */}
                      {item.targetPhone || item.targetEmail || "정보 없음"}
                    </span>
                    {/* (선택사항) 등록일 보여주고 싶으면 주석 해제 */}
                    {/* <span className="text-[10px] text-gray-300 mt-1">{item.createDate}</span> */}
                  </div>

                  <button
                    onClick={() => handleUnblock(item.blockId)}
                    className="px-3 py-1.5 border border-gray-200 text-gray-500 text-xs font-bold rounded hover:bg-gray-100 hover:text-red-500 transition-all ml-4"
                  >
                    해제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 3. 푸터 */}
        <div className="p-5 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#ff4b6e] hover:bg-[#ff3b60] text-white font-bold rounded text-[15px] transition-all shadow-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockListModal;
