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
  Navigation,
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
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "auto", block: "start" });
    }

    const fetchDetail = async () => {
      try {
        const response = await axios.get(`http://localhost/api/places/${id}`);
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
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#FF4458] border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      </div>
    );

  if (!place)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        정보를 찾을 수 없습니다.
      </div>
    );

  const handleNavigation = () => {
    const query = place.address || place.infoName;
    window.open(`https://map.naver.com/v5/search/${query}`, "_blank");
  };

  const lat = place.lat ? parseFloat(place.lat) : 37.5665;
  const lng = place.lng ? parseFloat(place.lng) : 126.978;

  return (
    <div ref={topRef} className="w-full min-h-screen bg-white pb-20">
      <div className="relative w-full h-[500px] md:h-[60vh]">
        <img
          src={place.imgUrl || "/placeholder.png"}
          alt={place.infoName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/1920x1080?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

        <div className="absolute top-0 left-0 w-full p-6 z-10">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all hover:-translate-x-1 cursor-pointer"
            >
              <ChevronLeft size={28} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="bg-black/50 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 rounded-full text-sm font-bold">
                {place.locationType === "CAFE" ? "☕ 카페" : "🍴 맛집"}
              </div>
              <div className="bg-[#FF4458] text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg animate-bounce-slow">
                <Sparkles size={14} fill="currentColor" /> AI 추천 장소
              </div>
              {place.aiTags &&
                place.aiTags
                  .replace(/,/g, " ")
                  .split(" ")
                  .filter((t) => t.startsWith("#"))
                  .map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full text-xs font-bold"
                    >
                      {t}
                    </span>
                  ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-lg leading-tight">
              {place.infoName}
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-medium flex items-center gap-2">
              <MapPin size={20} className="text-[#FF4458]" /> {place.address}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
        <div className="flex-1 flex flex-col gap-12">
          <section className="bg-pink-50/60 rounded-[32px] p-8 md:p-12 relative border border-pink-100 shadow-sm">
            <h3 className="text-[#FF4458] font-bold text-sm mb-6 flex items-center gap-2 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 bg-[#FF4458] rounded-full animate-pulse"></span>
              AI Curator's Note
            </h3>
            <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed font-serif break-keep">
              "{" "}
              {place.aiNote ||
                "이곳은 당신을 위한 특별한 경험을 제공하는 장소입니다."}{" "}
              "
            </p>
            <p className="mt-8 pt-8 border-t border-pink-200/60 text-gray-600 leading-loose text-sm md:text-base">
              {place.infoBody
                ? place.infoBody.replace(/(<([^>]+)>)/gi, "").substring(0, 300)
                : "상세 정보가 없습니다."}
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Info</h3>

            <section className="w-full h-[350px] bg-gray-100 rounded-3xl relative overflow-hidden border border-gray-200 z-0">
              <Map
                center={{ lat: lat, lng: lng }}
                style={{ width: "100%", height: "100%" }}
                level={3}
              >
                <MapMarker position={{ lat: lat, lng: lng }} />
              </Map>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              <InfoItem
                icon={<Clock />}
                title="영업시간"
                desc={place.openTime}
              />
              <InfoItem icon={<Phone />} title="전화번호" desc={place.tel} />
              <InfoItem
                icon={<Calendar />}
                title="휴무일"
                desc={place.restDay}
              />
              <InfoItem
                icon={<Globe />}
                title="홈페이지"
                desc="웹사이트 방문하기"
                link={place.homepage}
              />
            </div>

            <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-600 font-medium">
                <span>🅿️ 주차 정보:</span>
                <span>{place.parking || "정보 없음"}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:w-[380px] shrink-0">
          <div className="sticky top-24 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
              <h4 className="font-bold text-gray-800 text-lg mb-4">
                함께 가고 싶다면?
              </h4>
              <p className="text-sm text-gray-500 mb-6">
                상대방에게 이 장소를 공유해보세요.
              </p>
              <button className="w-full py-4 bg-[#EE4B6F] hover:bg-[#d63a5c] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-pink-200 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Share2 size={20} /> 이 장소 공유하기
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full mt-3 py-4 bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-2xl font-bold text-base transition-all cursor-pointer"
              >
                다른 장소 더보기
              </button>
            </div>
            <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100">
              <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                <span className="text-xl">💡</span> 방문 꿀팁
              </h4>
              <p className="text-sm text-yellow-900 leading-relaxed font-medium">
                {place.menu
                  ? `추천 메뉴: ${place.menu}`
                  : "주말 오후에는 사람이 많을 수 있어요."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, title, desc, link }) => (
  <div className="p-6 border border-gray-100 rounded-2xl flex items-start gap-4 bg-white hover:border-pink-200 hover:shadow-sm transition-all group">
    <div className="text-gray-400 mt-1 bg-gray-50 p-2 rounded-full group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors">
      {icon}
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="font-bold text-gray-900 mb-1 text-sm">{title}</p>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline text-sm truncate block"
        >
          {desc || "링크 바로가기"}
        </a>
      ) : (
        <p className="text-gray-600 text-sm break-keep">
          {desc || "정보 없음"}
        </p>
      )}
    </div>
  </div>
);

export default PlacesDetail;
