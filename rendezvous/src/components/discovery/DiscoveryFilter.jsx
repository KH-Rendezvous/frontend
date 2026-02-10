import React, { useState, useEffect } from 'react';

// loginMember를 props로 추가해서 유저의 기본 설정값을 가져옵니다.
const DiscoveryFilter = ({ onApplyFilter, loginMember }) => {
    
    // 1. 모든 초기값을 로그인 유저의 정보로 설정 (하드코딩 제거)
    // loginMember가 없으면 대비해서 기본값(예: 100, 19, 99)을 적어둡니다.
    const [range, setRange] = useState(loginMember?.targetDistance || 100); 
    const [ageRange, setAgeRange] = useState({ 
        min: loginMember?.minAge || 19, 
        max: loginMember?.maxAge || 99 
    }); 
    const [gender, setGender] = useState(loginMember?.targetGender || 'ALL'); 

    // 2. 유저 정보가 뒤늦게 로드될 경우를 대비해 데이터를 동기화합니다.
    useEffect(() => {
        if (loginMember) {
            setRange(loginMember.targetDistance || 100);
            setAgeRange({ 
                min: loginMember.minAge || 19, 
                max: loginMember.maxAge || 99 
            });
            setGender(loginMember.targetGender || 'ALL');
        }
    }, [loginMember]);

    const handleApply = () => {
        // 부모 컴포넌트로 현재 '상태값'만 전달 (글자 'F' 같은 거 절대 안 씀)
        onApplyFilter({
            distance: range,
            minAge: ageRange.min,
            maxAge: ageRange.max,
            gender: gender
        });
    };

    return (
        <div className="p-6 space-y-8">
            <h3 className="text-lg font-black italic">소셜 디스커버리 범위 설정</h3>
            
            {/* 성별 선택 섹션 */}
            <section className="space-y-3">
                <div className="font-bold text-gray-700">보고 싶은 성별</div>
                <div className="flex gap-2">
                    {['ALL', 'M', 'F'].map((g) => (
                        <button
                            key={g}
                            onClick={() => setGender(g)}
                            className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                                gender === g 
                                ? 'bg-[#FF4458] text-white border-[#FF4458]' 
                                : 'bg-white text-gray-500 border-gray-200'
                            }`}
                        >
                            {g === 'ALL' ? '모두' : g === 'M' ? '남성' : '여성'}
                        </button>
                    ))}
                </div>
            </section>

            {/* 거리 슬라이더 */}
            <section>
                <div className="flex justify-between font-bold">
                    <span>상대와의 거리</span>
                    <span className="text-[#FF4458]">{range}km</span>
                </div>
                <input type="range" min="1" max="160" value={range} 
                       onChange={(e) => setRange(Number(e.target.value))}
                       className="w-full accent-[#FF4458]" />
            </section>

            {/* 연령대 슬라이더 */}
            <section>
                <div className="flex justify-between font-bold">
                    <span>상대의 연령대</span>
                    <span className="text-[#FF4458]">{ageRange.min} - {ageRange.max}</span>
                </div>
                <div className="flex gap-2 mt-2">
                    <input type="number" 
                           value={ageRange.min} 
                           onChange={(e) => setAgeRange({...ageRange, min: Math.max(19, Number(e.target.value))})}
                           className="w-1/2 p-2 border rounded-lg text-center" 
                           placeholder="최소" />
                    <input type="number" 
                           value={ageRange.max} 
                           onChange={(e) => setAgeRange({...ageRange, max: Math.min(100, Number(e.target.value))})}
                           className="w-1/2 p-2 border rounded-lg text-center" 
                           placeholder="최대" />
                </div>
            </section>

            <button onClick={handleApply} className="w-full py-4 bg-[#FF4458] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
                필터 적용하기
            </button>
        </div>
    );
};

export default DiscoveryFilter;