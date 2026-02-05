import React, { useState, useEffect } from "react";
// import axios from "axios"; // 안 쓰면 삭제
import { axiosApi } from "../../../api/axiosAPI";

const BlockListModal = ({ isOpen, onClose, memberNo }) => {
  const [blockList, setBlockList] = useState([]);

  useEffect(() => {
    if (isOpen && memberNo) {
      getBlockList();
    }
  }, [isOpen, memberNo]);

  const getBlockList = async () => {
    try {
      const response = await axiosApi.get("/api/block/list", {
        params: { memberNo: memberNo },
      });

      console.log("서버 응답 데이터:", response.data);

      if (Array.isArray(response.data)) {
        setBlockList(response.data);
      } else {
        setBlockList([]);
      }
    } catch (error) {
      console.error("차단 목록 로딩 실패:", error);
      setBlockList([]);
    }
  };

  const handleUnblock = async (blockId) => {
    if (!window.confirm("정말 차단을 해제하시겠습니까?")) return;

    try {
      const response = await axiosApi.delete("/api/block/delete", {
        data: {
          blockId: blockId,
          memberNo: memberNo,
        },
      });

      if (response.data === "success" || response.data === 1) {
        alert("해제되었습니다.");
        setBlockList((prev) => prev.filter((item) => item.blockId !== blockId));
      } else {
        alert("해제 실패");
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
                      {item.targetPhone || item.targetEmail || "정보 없음"}
                    </span>
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
