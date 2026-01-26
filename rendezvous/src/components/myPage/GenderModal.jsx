import React, { useState, useEffect } from 'react';

const GenderModal = ({ isOpen, onClose, currentGender, onSave }) => {
  // 모달 내부에서만 쓸 임시 선택값 (저장 누르기 전까지는 반영 안 됨)
  const [selected, setSelected] = useState(currentGender);

  // 모달 열릴 때마다 부모의 현재 설정값을 가져옴
  useEffect(() => {
    setSelected(currentGender);
  }, [isOpen, currentGender]);

  if (!isOpen) return null;

  const options = ['모든 성별', '여성', '남성'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      
      <div 
        className="bg-white w-[90%] max-w-xs rounded-xl shadow-lg overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* 헤더 */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">보고 싶은 성별</h3>
        </div>

        {/* 선택 리스트 */}
        <div className="flex flex-col">
          {options.map((option) => (
            <label 
              key={option} 
              className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
            >
              <span className={`text-sm font-medium ${selected === option ? 'text-[#ff4b6e]' : 'text-gray-700'}`}>
                {option}
              </span>
              
              {/* 실제 라디오 버튼은 숨기고 커스텀 UI 보여주기 */}
              <input 
                type="radio" 
                name="gender" 
                value={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
                className="hidden" 
              />
              
              {/* 선택됐을 때만 체크 표시 보임 */}
              {selected === option && (
                <span className="text-[#EE4B6F] font-bold text-lg">✓</span>
              )}
            </label>
          ))}
        </div>

        {/* 하단 저장 버튼 */}
        <div className="p-4 bg-gray-50">
          <button 
            className="w-full bg-[#ff4b6e] hover:bg-[#ff3b60] text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
            onClick={() => {
              onSave(selected); // 부모한테 변경된 값 전달
              onClose(); // 모달 닫기
            }}
          >
            확인
          </button>
        </div>

      </div>
    </div>
  );
};

export default GenderModal;