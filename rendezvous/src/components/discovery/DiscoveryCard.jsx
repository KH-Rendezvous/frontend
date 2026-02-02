import React, { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown, Heart, X, MapPin } from "lucide-react";

const DiscoveryCard = ({ user, onSwipe }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  
  // [수정] 자바 DTO에서 넘어오는 필드명은 소문자입니다.
  // DB의 PHOTO_URL -> photoUrl, NICKNAME -> nickname
  const photos = [user.photoUrl || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1"];

  // 드래그 애니메이션 값
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

  return (
    <div className="relative w-[380px] h-[600px] flex flex-col items-center font-sans">
      <motion.div
        style={{ x, rotate, opacity }}
        drag={showInfo ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (!showInfo && info.offset.x > 100) onSwipe("right");
          else if (!showInfo && info.offset.x < -100) onSwipe("left");
        }}
        className="absolute w-full h-[540px] bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 cursor-grab active:cursor-grabbing"
      >
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-10 z-50 border-[6px] border-[#FF4458] text-[#FF4458] text-5xl font-black px-4 py-1 rounded-xl uppercase -rotate-12 pointer-events-none">LIKE</motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-10 z-50 border-[6px] border-gray-400 text-gray-400 text-5xl font-black px-4 py-1 rounded-xl uppercase rotate-12 pointer-events-none">NOPE</motion.div>

        <div className="relative w-full h-full bg-gray-100">
          <img src={photos[imgIndex]} alt="" className="w-full h-full object-cover pointer-events-none" />
          
          <div className="absolute top-3 inset-x-4 flex gap-1 z-20">
            {photos.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i === imgIndex ? "bg-white" : "bg-white/30"}`} />
            ))}
          </div>

          <div className="absolute inset-0 flex z-10">
            <div className="flex-1" onClick={() => imgIndex > 0 && setImgIndex(imgIndex - 1)} />
            <div className="flex-1" onClick={() => imgIndex < photos.length - 1 && setImgIndex(imgIndex + 1)} />
          </div>

          {!showInfo && (
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 text-white flex flex-col justify-end pointer-events-none">
              <h2 className="text-3xl font-black">{user.nickname}, {user.age}</h2>
              {/* [수정] DB의 RESIDENCE 필드 사용 */}
              <p className="text-sm flex items-center gap-1 mt-1 opacity-90"><MapPin size={14} /> {user.residence}</p>
              <p className="text-xs opacity-70 mt-0.5">{user.distance}km 주변에 있음</p>
            </div>
          )}

          <AnimatePresence>
            {showInfo && (
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 bg-white z-30 overflow-y-auto">
                <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-gray-50 flex justify-between items-center z-40">
                  <h3 className="font-black text-lg">{user.nickname}, {user.age}</h3>
                  <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-gray-600"><ChevronDown size={28} /></button>
                </div>
                <div className="p-6 space-y-8 pb-10">
                  <section>
                    <h4 className="text-gray-900 font-bold mb-2">자기소개</h4>
                    <p className="text-gray-600 text-[15px] leading-relaxed">{user.intro || "안녕하세요! 반갑습니다."}</p>
                  </section>
                  <section>
                    <h4 className="text-gray-900 font-bold mb-4">나에 대한 정보</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                        <span className="text-gray-500 flex items-center gap-2">📄 MBTI</span>
                        <span className="font-semibold text-gray-800">{user.mbti}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                        <span className="text-gray-500 flex items-center gap-2">🏠 거주지</span>
                        <span className="font-semibold text-gray-800">{user.residence}</span>
                      </div>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="absolute bottom-0 flex items-center gap-5 z-20">
        <button onClick={() => onSwipe("left")} className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-xl text-gray-300 border border-gray-50 hover:scale-110 active:scale-90 transition-all"><X size={35} strokeWidth={3} /></button>
        <button onClick={() => setShowInfo(!showInfo)} className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all ${showInfo ? "bg-black text-white" : "bg-white text-gray-300 border border-gray-50"}`}><ChevronDown size={28} className={showInfo ? "rotate-180" : ""} /></button>
        <button onClick={() => onSwipe("right")} className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-xl text-pink-500 border border-gray-50 hover:scale-110 active:scale-90 transition-all"><Heart size={35} fill="currentColor" /></button>
      </div>
    </div>
  );
};

export default DiscoveryCard;