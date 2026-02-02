import React, { useRef, useState } from "react";

const ProfileImageGrid = ({ images, setImages, setDeleteList }) => {
  const fileInputRef = useRef(null);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(null);

  const handleImageClick = (index) => {
    setCurrentUploadIndex(index);
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImages((prev) => {
      const newImages = [...prev];

      // 자동 밀어넣기
      let targetIndex = currentUploadIndex; // 기본값: 클릭한 위치

      // 만약 사용자가 '빈 칸'을 눌러서 새 사진을 올리는 경우라면?
      if (newImages[targetIndex] === null) {
        // 앞에서부터 비어있는 첫 번째 칸을 찾는다
        const firstEmptyIndex = newImages.findIndex((img) => img === null);

        // 빈 칸이 존재한다면 거기로 타겟을 변경 (예: 5번 눌렀어도 3번이 비었으면 3번으로)
        if (firstEmptyIndex !== -1) {
          targetIndex = firstEmptyIndex;
        }
      }
      // (기존 이미지를 덮어쓰는 경우라면 위 로직을 타지 않고 클릭한 위치(targetIndex) 유지됨)
      // 기존 이미지가 있다면 삭제 리스트에 추가 (위치가 바뀌었을 수 있으니 targetIndex 사용)
      if (newImages[targetIndex]?.id) {
        setDeleteList((prevDel) => [...prevDel, newImages[targetIndex].id]);
      }

      newImages[targetIndex] = {
        id: null,
        url: previewUrl,
        file: file,
        order: targetIndex + 1,
      };
      return newImages;
    });

    e.target.value = "";
  };

  const handleDeleteImage = (e, index) => {
    e.stopPropagation();

    if (images[index] && images[index].id) {
      setDeleteList((prev) => [...prev, images[index].id]);
    }

    setImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
  };

  return (
    <div className="grid grid-cols-3 gap-3 mb-2">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {images.map((img, index) => (
        <div
          key={index}
          onClick={() => handleImageClick(index)}
          className={`relative aspect-[3/4] rounded-xl border flex items-center justify-center group cursor-pointer transition-colors
            ${img ? "border-transparent" : "bg-gray-50 border-gray-100 hover:border-gray-300"}
          `}
        >
          {img ? (
            <>
              <img
                src={img.url}
                alt={`profile-${index}`}
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                onClick={(e) => handleDeleteImage(e, index)}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all z-20"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          ) : (
            <span className="text-gray-300 text-2xl font-light">+</span>
          )}

          {/* 뱃지 영역 */}
          <div
            className={`absolute -bottom-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full shadow-sm border-2 border-white z-50
             ${index === 0 ? "bg-[#EE4B6F]" : "bg-gray-400"} text-white`}
          >
            {index === 0 ? (
              // 별 아이콘 (SVG)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // + 아이콘 (SVG)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileImageGrid;
