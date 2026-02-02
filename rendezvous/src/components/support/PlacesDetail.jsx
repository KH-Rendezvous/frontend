import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Sparkles,
  Clock,
  Phone,
  Calendar,
  Globe,
  Share2,
} from "lucide-react";
import axios from "axios";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const PlacesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지 진입 시 스크롤 최상단으로 이동
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "auto", block: "start" });
    }

    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:80/api/places/${id}`
        );
        setPlace(response.data);
      } catch (error) {
        console.error("상세 정보 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FF4458] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm tracking-widest text-[#FF4458] font-bold">
            AI 분석 중...
          </p>
        </div>
      </div>
    );

  if (!place)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        정보를 찾을 수 없습니다.
      </div>
    );

  // 좌표 정보가 없을 경우 기본값 (서울시청)
  const lat = place.lat ? parseFloat(place.lat) : 37.5665;
  const lng = place.lng ? parseFloat(place.lng) : 126.978;

  // AI 태그 배열 처리
  const aiTags = place.aiTags
    ? place.aiTags
        .replace(/,/g, " ")
        .split(" ")
        .filter((t) => t.startsWith("#"))
    : [];

  return (
    <div ref={topRef} className="w-full min-h-screen bg-white pb-20 font-sans">
      {/* --- [1] 상단 히어로 이미지 섹션 --- */}
      <div className="relative w-full h-[500px] md:h-[60vh] bg-black">
        <img
          src={place.imgUrl || "/placeholder.png"}
          alt={place.infoName}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/1920x1080?text=No+Image";
          }}
        />
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        {/* 뒤로가기 버튼 */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all hover:-translate-x-1"
          >
            <ChevronLeft size={28} />
          </button>
        </div>

        {/* 타이틀 및 정보 */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
          <div className="max-w-7xl mx-auto animate-fadeInUp">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-black/40 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {place.locationType === "CAFE"
                  ? "CAFE & DESSERT"
                  : "RESTAURANT"}
              </span>
              <span className="bg-[#FF4458] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Sparkles size={12} fill="currentColor" /> AI 추천
              </span>
              {aiTags.slice(0, 3).map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full text-xs font-bold"
                >
                  {t}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 drop-shadow-lg leading-tight">
              {place.infoName}
            </h1>
            <div className="flex items-center text-white/90 text-lg font-medium">
              <MapPin size={20} className="text-[#FF4458] mr-2" />
              {place.address}
            </div>
          </div>
        </div>
      </div>

      {/* --- [2] 메인 컨텐츠 영역 --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
        {/* 왼쪽: 상세 정보 및 지도 */}
        <div className="flex-1 flex flex-col gap-10">
          {/* AI 큐레이터 노트 */}
          <section className="bg-gradient-to-br from-pink-50 to-white rounded-[32px] p-8 md:p-10 border border-pink-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#FF4458]/10 rounded-full blur-3xl" />

            <h3 className="text-[#FF4458] font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-widest">
              <Sparkles size={16} /> AI Curator's Note
            </h3>
            <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed font-serif break-keep">
              "{" "}
              {place.aiNote ||
                "이곳은 당신을 위한 특별한 경험을 제공하는 장소입니다."}{" "}
              "
            </p>
            <div className="mt-8 pt-8 border-t border-pink-100 text-gray-600 leading-loose text-sm md:text-base">
              {place.infoBody
                ? place.infoBody.replace(/(<([^>]+)>)/gi, "").substring(0, 300)
                : "상세 정보가 없습니다."}
              {place.infoBody && place.infoBody.length > 300 && "..."}
            </div>
          </section>

          {/* 기본 정보 (아이콘 그리드) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<Clock />}
              title="영업시간"
              desc={place.openTime || "정보 없음"}
            />
            <InfoItem
              icon={<Phone />}
              title="전화번호"
              desc={place.tel || "정보 없음"}
            />
            <InfoItem
              icon={<Calendar />}
              title="휴무일"
              desc={place.restDay || "연중무휴 (변동 가능)"}
            />
            <InfoItem
              icon={<Globe />}
              title="홈페이지"
              desc={place.homepage ? "웹사이트 방문하기" : "정보 없음"}
              link={place.homepage}
            />
          </div>

          {/* 지도 (카카오맵) */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="text-gray-400" /> 위치 확인
            </h3>
            <div className="w-full h-[400px] bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-inner">
              <Map
                center={{ lat: lat, lng: lng }}
                style={{ width: "100%", height: "100%" }}
                level={3}
              >
                <MapMarker position={{ lat: lat, lng: lng }} />
              </Map>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 flex items-center gap-2 text-sm text-gray-600 font-bold">
                <span>🅿️ 주차 가능 여부:</span>
                <span className="text-gray-800">
                  {place.parking || "정보 없음"}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* 오른쪽: 사이드바 (공유 및 꿀팁) */}
        <div className="lg:w-[380px] shrink-0">
          <div className="sticky top-24 flex flex-col gap-6">
            {/* 공유하기 카드 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40">
              <h4 className="font-bold text-gray-900 text-lg mb-2">
                마음에 드시나요?
              </h4>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                연인에게 이 장소를 공유하고
                <br /> 함께 갈 약속을 잡아보세요!
              </p>
              <button
                onClick={() => {
                  // 공유하기 로직 (클립보드 복사 등)
                  navigator.clipboard.writeText(window.location.href);
                  alert("주소가 복사되었습니다!");
                }}
                className="w-full py-4 bg-[#FF4458] hover:bg-[#d63a5c] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-pink-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Share2 size={20} /> 공유하기
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full mt-3 py-4 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-2xl font-bold text-base transition-all cursor-pointer active:scale-95"
              >
                다른 장소 더보기
              </button>
            </div>

            {/* 꿀팁 카드 */}
            <div className="bg-[#FFF9E6] p-8 rounded-3xl border border-[#FFE8A3] relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-[#FFD768]/20 rounded-full blur-2xl" />
              <h4 className="font-bold text-[#B48300] mb-3 flex items-center gap-2 text-lg">
                <span className="text-2xl">💡</span> 방문 꿀팁
              </h4>
              <p className="text-sm text-[#8A6D3B] leading-relaxed font-medium">
                {place.menu
                  ? `추천 메뉴: ${place.menu}`
                  : "주말 점심/저녁 시간에는 웨이팅이 있을 수 있으니 예약을 추천드려요!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 정보 아이템 컴포넌트
const InfoItem = ({ icon, title, desc, link }) => (
  <div className="p-5 border border-gray-100 rounded-2xl flex items-start gap-4 bg-white hover:border-pink-200 hover:shadow-md transition-all group h-full">
    <div className="text-gray-400 mt-0.5 bg-gray-50 p-2.5 rounded-full group-hover:bg-pink-50 group-hover:text-[#FF4458] transition-colors">
      {icon}
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="font-bold text-gray-900 mb-1 text-sm">{title}</p>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:text-blue-700 hover:underline text-sm truncate block font-medium"
        >
          {desc}
        </a>
      ) : (
        <p className="text-gray-600 text-sm break-keep font-medium leading-relaxed">
          {desc}
        </p>
      )}
    </div>
  </div>
);

export default PlacesDetail;
