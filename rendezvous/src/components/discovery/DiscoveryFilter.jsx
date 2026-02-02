import React, { useState } from 'react';

const DiscoveryFilter = ({ onApplyFilter }) => {
    const [range, setRange] = useState(97); // 거리
    const [ageRange, setAgeRange] = useState({ min: 19, max: 26 }); // 연령

    const handleApply = () => {
        // 부모 컴포넌트(DiscoveryMain)로 필터 값 전달
        onApplyFilter({
            distance: range,
            minAge: ageRange.min,
            maxAge: ageRange.max,
            gender: 'F'
        });
    };

    return (
        <div className="p-6 space-y-8">
            <h3 className="text-lg font-black italic">소셜 디스커버리 범위 설정</h3>
            
            {/* 거리 슬라이더 */}
            <section>
                <div className="flex justify-between font-bold">
                    <span>상대와의 거리</span>
                    <span className="text-[#FF4458]">{range}km</span>
                </div>
                <input type="range" min="1" max="160" value={range} 
                       onChange={(e) => setRange(e.target.value)}
                       className="w-full accent-[#FF4458]" />
            </section>

            {/* 연령대 슬라이더 (실제 구현 시 라이브러리 사용 추천) */}
            <section>
                <div className="flex justify-between font-bold">
                    <span>상대의 연령대</span>
                    <span className="text-[#FF4458]">{ageRange.min} - {ageRange.max}</span>
                </div>
                {/* 연령 조절 UI... */}
            </section>

            <button onClick={handleApply} className="w-full py-4 bg-[#FF4458] text-white rounded-2xl font-bold">
                필터 적용하기
            </button>
        </div>
    );
};