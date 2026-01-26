import React, { useState } from 'react';
// 1. 라이브러리랑 스타일 import
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; 
import BlockModal from './BlockModal';
import GenderModal from './GenderModal';

// 2. 컴포넌트 이름 파일명에 맞게 변경
const MyPageSidebar = () => {
  const [distance, setDistance] = useState(11);
  // 3. 나이 범위는 숫자 하나가 아니라 [최소, 최대] 배열이어야 함
  const [ageRange, setAgeRange] = useState([19, 39]); 

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);
  const [gender, setGender] = useState('여성'); // 기본값 '여성'

  // 거리 바뀔 때 실행되는 함수
  const handleDistanceChange = (value) => {
    setDistance(value);
  };

  // 나이 바뀔 때 실행되는 함수
  const handleAgeChange = (value) => {
    setAgeRange(value);
  };

  return (
    <aside className="w-[360px] h-screen bg-[#FDFCFB] border-r border-gray-200 flex flex-col font-sans sticky top-0 left-0 overflow-y-auto custom-scrollbar">
      
      {/* 1. 헤더 & 탭 */}
      <div className="p-6 pb-0">
        <h1 className="text-[#EE4B6F] font-bold text-2xl text-center mb-6 tracking-tight cursor-default">
          Rendezvous
        </h1>
        
        <div className="flex justify-between bg-white border border-gray-200 rounded-[20px] p-1 shadow-sm mb-6">

          <button className="flex-1 py-2.5 text-sm font-bold text-black hover:bg-gray-50 hover:text-black rounded-[15px] transition-all">
            탐색
          </button>
          
          <button className="flex-1 py-2.5 text-sm font-bold text-black hover:bg-gray-50 hover:text-black rounded-[15px] transition-all">
            매칭
          </button>
          
          <button className="flex-1 py-2.5 text-sm font-bold text-black hover:bg-gray-50 hover:text-black rounded-[15px] relative transition-all">
            채팅
            <span className="absolute -top-1 -right-1 bg-[#EE4B6F] text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white shadow-sm">
              17
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        
        {/* 2. 소셜 디스커버리 범위 설정 */}
        <div className="mb-8">
          <h3 className="text-[15px] font-bold text-gray-800 mb-2 border-b border-gray-800 pb-3">
            소셜 디스커버리 범위 설정
          </h3>

          <div className="py-5 px-1 border-b border-gray-100">
            <div className="flex justify-between mb-4 text-sm font-medium">
              <span className="text-black">상대와의 거리</span>
              <span className="text-gray-800">{distance}km</span>
            </div>
            {/* 거리 슬라이더 (점 1개) */}
            <div className="px-2">
              <Slider
                min={1} 
                max={50} 
                value={distance} 
                onChange={handleDistanceChange} 
                styles={{
                  track: { backgroundColor: '#EE4B6F', height: 4 },
                  handle: { 
                    borderColor: '#EE4B6F', 
                    backgroundColor: '#EE4B6F', 
                    opacity: 1, 
                    boxShadow: 'none',
                    height: 14, 
                    width: 14, 
                    marginTop: -5 
                  },
                  rail: { backgroundColor: '#e5e7eb', height: 4 }
                }}
              />
              
            </div>
          </div>

          <div 
            // 클릭하면 성별 모달 열기
            onClick={() => setIsGenderModalOpen(true)}
            className="flex justify-between items-center py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group px-1"
          >
            <span className="text-sm font-medium text-black group-hover:text-gray-900">보고 싶은 성별</span>
            {/* 현재 설정된 gender 값을 보여줌 */}
            <span className="text-sm text-gray-500 group-hover:text-gray-800">{gender} {'>'}</span>
          </div>

          <div className="py-5 px-1 border-b border-gray-100">
            <div className="flex justify-between mb-4 text-sm font-medium">
              <span className="text-black">상대의 연령대</span>
              {/* 4. 배열 값 보여주기 (예: 19 - 39) */}
              <span className="text-gray-800">{ageRange[0]} - {ageRange[1]}</span>
            </div>
            
            {/* 5. Slider 컴포넌트 사용 */}
            <div className="px-2">
              <Slider
                range 
                min={19}
                max={50}
                value={ageRange}
                onChange={handleAgeChange}
                
                styles={{
                  track: { backgroundColor: '#EE4B6F', height: 4 },
                  handle: { 
                    borderColor: '#EE4B6F', 
                    backgroundColor: '#EE4B6F', 
                    opacity: 1, 
                    boxShadow: 'none',
                    height: 14,
                    width: 14,
                    marginTop: -5 
                  },
                  rail: { backgroundColor: '#e5e7eb', height: 4 }
                }}
              />
            </div>
          </div>
        </div>

        {/* 3. 프로필 공개 설정 */}
        <div className="mb-8">
          <h3 className="text-[15px] font-bold text-gray-800 mb-2 border-b border-gray-800 pb-3">
            프로필 공개 설정
          </h3>
          
          <label className="flex justify-between items-center py-4 cursor-pointer hover:bg-gray-50 transition-colors px-1 border-b border-gray-100">
            <div>
              <div className="text-sm font-bold text-gray-700 mb-1">모든 상대</div>
              <div className="text-xs text-gray-500">내 프로필이 모든 상대에게 표시됩니다.</div>
            </div>
            <input type="radio" name="visibility" defaultChecked className="w-5 h-5 accent-[#EE4B6F] cursor-pointer" />
          </label>
          
          <label className="flex justify-between items-center py-4 cursor-pointer hover:bg-gray-50 transition-colors px-1 border-b border-gray-100">
            <div>
              <div className="text-sm font-bold text-gray-700 mb-1">비공개 모드</div>
              <div className="text-xs text-gray-500">내가 LIKE한 사람만 볼 수 있습니다.</div>
            </div>
            <input type="radio" name="visibility" className="w-5 h-5 accent-[#EE4B6F] cursor-pointer" />
          </label>
        </div>

        {/* 4. 차단 설정 */}
        <div className="mb-10">
            <h3 className="text-[15px] font-bold text-gray-800 mb-2 border-b border-gray-800 pb-3">
              차단 설정
            </h3>
            
            <div 
              onClick={() => setIsModalOpen(true)}
              className="flex justify-between items-center py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors px-1"
            >
                <span className="text-sm font-medium text-black">연락처 차단</span>
                <span className="text-gray-400">{'>'}</span>
            </div>
            
            <p className="text-xs text-gray-400 mt-2 mb-4 leading-relaxed px-1">
            Rendezvous에서 보고 싶지 않거나 내 프로필을 보이고 싶지 않은 사람이 있다면 선택해 주세요.
            </p>
          </div>

        {/* 5. 하단 버튼들 */}
        <div className="space-y-3">
          <button className="w-full py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
            QnA
          </button>
          <button className="w-full py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
            로그아웃
          </button>
          <button className="w-full py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
            회원탈퇴
          </button>
        </div>

      </div>
      <BlockModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <GenderModal 
        isOpen={isGenderModalOpen}
        onClose={() => setIsGenderModalOpen(false)}
        currentGender={gender}
        onSave={(newGender) => setGender(newGender)}
      />
    </aside>
  );
};

export default MyPageSidebar;