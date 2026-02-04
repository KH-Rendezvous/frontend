import React, { useState } from "react";
import InterestEditModal from "../../myPage/modals/InterestEditModal";
import RelationModal from "../signup/RelationModal";

const INTEREST_LIST = [
  "운동",
  "게임",
  "코딩",
  "독서",
  "영화",
  "여행",
  "요리",
  "음악",
  "등산",
  "반려동물",
  "카페",
  "맛집",
  "드라이브",
  "전시회",
  "재테크",
  "패션",
  "사진",
  "술",
];

const SignupPage = () => {
  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    authCode: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    targetGender: "",
    interests: [],
    relation: "",
  });

  // 모달 열림/닫힘 상태 관리
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);

  const [isRelationModalOpen, setIsRelationModalOpen] = useState(false);

  // 관심사 저장 핸들러 (모달에서 저장 버튼 눌렀을 때 실행됨)
  const handleInterestSave = (selectedInterests) => {
    setFormData((prev) => ({ ...prev, interests: selectedInterests }));
    setIsInterestModalOpen(false);
  };

  // 2. 저장 핸들러 추가
  const handleRelationSave = (selectedId) => {
    setFormData((prev) => ({ ...prev, relation: selectedId }));
    setIsRelationModalOpen(false);
  };

  // 에러 메시지 상태 관리
  const [errors, setErrors] = useState({});

  // 이미지 상태 관리
  const [images, setImages] = useState(Array(6).fill(null));

  // 날짜 유효성 검사 헬퍼 함수 (해당 연도/월의 마지막 날짜 반환)
  const getMaxDays = (year, month) => {
    if (!year || !month) return 31;
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  // 만 나이 계산 및 유효성 검사 헬퍼
  const checkAgeAndYear = (year, month, day) => {
    const today = new Date();
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    // 1. 비현실적인 연도 체크 (1900년 미만은 에러 처리)
    if (year.length === 4 && y < 1900) {
      return {
        valid: false,
        msg: "정확한 생년월일을 입력해주세요.",
        target: "birthYear",
      };
    }

    // 연, 월, 일이 모두 입력되었을 때 만 나이 체크
    if (year.length === 4 && month && day) {
      let age = today.getFullYear() - y;
      const mDiff = today.getMonth() + 1 - m;

      // 생일이 안 지났으면 한 살 차감
      if (mDiff < 0 || (mDiff === 0 && today.getDate() < d)) {
        age--;
      }

      // 만 19세 미만 체크
      if (age < 19) {
        return {
          valid: false,
          msg: "만 19세 미만은 가입할 수 없습니다.",
          target: "birthYear",
        }; // 에러는 연도 쪽에 띄움
      }
    }
    return { valid: true };
  };

  // 유효성 검사 함수
  const validate = (name, value, currentFormData) => {
    let tempErrors = { ...errors };

    // 날짜 검사를 위해 최신 데이터 병합 (현재 입력중인 value 우선)
    const data = { ...currentFormData, [name]: value };

    // 앞뒤 공백 제거한 값 (검사용)
    const trimmedValue = typeof value === "string" ? value.trim() : value;

    switch (name) {
      case "name":
        // 글자 수 20자 제한
        if (trimmedValue.length > 20) {
          tempErrors.name = "이름은 20글자까지만 입력 가능합니다.";
        }
        // 중간 공백은 허용하되, 한글/영문만 가능 (자음/모음 단독 불가)
        else if (
          trimmedValue &&
          !/^[가-힣a-zA-Z]+[가-힣a-zA-Z ]*[가-힣a-zA-Z]+$|^[가-힣a-zA-Z]+$/.test(
            trimmedValue,
          )
        ) {
          tempErrors.name = "한글/영문만 입력 가능합니다";
        } else {
          delete tempErrors.name;
        }
        break;

      case "nickname":
        if (trimmedValue.length >= 10) {
          tempErrors.nickname = "닉네임은 10글자 이하만 가능합니다.";
        } else if (trimmedValue && !/^[가-힣a-zA-Z0-9]+$/.test(trimmedValue)) {
          tempErrors.nickname = "한글, 영문, 숫자만 입력 가능합니다.";
        } else {
          delete tempErrors.nickname;
        }
        break;

      case "email":
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (value && !emailRegex.test(value)) {
          tempErrors.email = "올바른 이메일 형식이 아닙니다.";
        } else {
          delete tempErrors.email;
        }
        break;

      case "authCode":
        if (trimmedValue && trimmedValue.length < 6) {
          tempErrors.authCode = "인증번호 6자리를 모두 입력해주세요.";
        } else {
          delete tempErrors.authCode;
        }
        break;

      case "password":
        // 1. 길이 8~20자로 상향
        const pwRegex =
          /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

        if (value && !pwRegex.test(value)) {
          tempErrors.password =
            "영문, 숫자, 특수문자 포함 8~20자리여야 합니다.";
        }
        // 2. 전화번호가 비밀번호에 포함되는지 확인 (보안 강화)
        else if (data.phone && value.includes(data.phone)) {
          tempErrors.password = "비밀번호에 전화번호를 포함할 수 없습니다.";
        }
        // 3. 이메일 아이디(@앞부분)가 비밀번호에 포함되는지 확인
        else if (data.email && value.includes(data.email.split("@")[0])) {
          tempErrors.password =
            "비밀번호에 아이디(이메일)를 포함할 수 없습니다.";
        } else {
          delete tempErrors.password;
        }

        // 비번 확인이랑 일치 여부 체크
        if (data.passwordConfirm && value !== data.passwordConfirm) {
          tempErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
        } else if (data.passwordConfirm && value === data.passwordConfirm) {
          delete tempErrors.passwordConfirm;
        }
        break;

      case "passwordConfirm":
        if (value !== data.password) {
          tempErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
        } else {
          delete tempErrors.passwordConfirm;
        }
        break;

      case "phone":
        if (value.length >= 3 && !/^(010|011)/.test(value)) {
          tempErrors.phone = "올바른 전화번호를 입력해주세요.";
        } else if (value.length > 0 && value.length < 11) {
          tempErrors.phone = "전화번호 11자리를 모두 입력해주세요.";
        } else {
          delete tempErrors.phone;
        }
        break;

      // --- 날짜 유효성 검사 (통합 로직 적용) ---
      case "birthYear":
      case "birthMonth":
      case "birthDay":
        // 1. 기본 필드 검사
        if (name === "birthMonth") {
          const month = parseInt(value);
          if (value && (month < 1 || month > 12)) {
            tempErrors.birthMonth = "정확한 날짜를 입력해주세요.";
          } else {
            delete tempErrors.birthMonth;
          }
        }
        if (name === "birthDay") {
          const day = parseInt(value);
          const currentMaxDay = getMaxDays(data.birthYear, data.birthMonth);
          if (value && (day < 1 || day > currentMaxDay)) {
            if (!data.birthMonth) {
              tempErrors.birthDay = "월을 먼저 입력해주세요.";
            } else {
              tempErrors.birthDay = `정확한 날짜를 입력해주세요.`;
            }
          } else {
            delete tempErrors.birthDay;
          }
        }

        // 2. 만 나이 및 연도 체크 (Year, Month, Day 중 하나라도 변경되면 전체 체크)
        // 기존 에러 클리어 (새로 체크하기 위해)
        if (name === "birthYear") delete tempErrors.birthYear;

        const checkResult = checkAgeAndYear(
          data.birthYear,
          data.birthMonth,
          data.birthDay,
        );

        if (!checkResult.valid) {
          // 에러 발생 시 해당 타겟에 메시지 할당
          tempErrors[checkResult.target] = checkResult.msg;
        } else {
          // 통과했으면 연도 관련 에러 삭제 (다른 날짜 필드 건드릴 때도 연도 에러가 남아있을 수 있으므로)
          delete tempErrors.birthYear;
        }
        break;

      default:
        break;
    }

    setErrors(tempErrors);
  };

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 1. 입력 제한 (Masking)
    if (name === "authCode") {
      if (!/^[a-zA-Z0-9]*$/.test(value) || value.length > 6) return;
    } else if (name === "phone") {
      if (!/^\d*$/.test(value) || value.length > 11) return;
    } else if (name === "birthYear") {
      if (!/^\d*$/.test(value) || value.length > 4) return;
    } else if (name === "birthMonth" || name === "birthDay") {
      if (!/^\d*$/.test(value) || value.length > 2) return;
    }

    // 2. 상태 업데이트
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 3. 유효성 검사 실행
    validate(name, value, formData);
  };

  const handleGenderSelect = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // 이미지 업로드 핸들러 (자동 순차 채우기 로직 적용)
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];

      // 1. 현재 클릭한 칸에 이미지가 있다면 -> 교체 (해당 칸만 업데이트)
      if (newImages[index]) {
        newImages[index] = {
          file: file,
          preview: URL.createObjectURL(file),
        };
      }
      // 2. 현재 클릭한 칸이 비어있다면 -> 앞에서부터 비어있는 칸 찾아서 넣기
      else {
        // 첫 번째 null인 인덱스 찾기
        const firstEmptyIndex = newImages.findIndex((img) => img === null);

        // 만약 빈 칸이 있다면 그곳에 할당 (없으면 현재 칸인데, 보통 빈 칸이 있겠지)
        const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : index;

        newImages[targetIndex] = {
          file: file,
          preview: URL.createObjectURL(file),
        };
      }

      setImages(newImages);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  // 가입 신청 버튼 핸들러 (최소 2장 체크)
  const handleSubmit = (e) => {
    e.preventDefault(); // form submit 방지

    // 1. 이미지 개수 체크
    const validImageCount = images.filter((img) => img !== null).length;
    if (validImageCount < 2) {
      alert("프로필 사진은 최소 2장 이상 등록해야 합니다.");
      return;
    }

    // 2. 나머지 유효성 검사 통과 여부 확인 (errors 객체가 비어있고 필수값이 다 찼는지 등)
    // (여기서는 간단히 로그만 찍음)
    console.log("Submitting form...", formData);
    alert("가입 신청이 완료되었습니다!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-10">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        {/* --- 왼쪽: 기본 정보 입력 --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              계정 만들기
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              설레는 만남의 시작, Rendezvous와 함께하세요.
            </p>
          </div>

          <form className="space-y-5">
            {/* 이름 & 닉네임 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 ml-1">
                  이름
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="실명 입력"
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                    errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-[#EE4B6F]"
                  }`}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 ml-1 mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 ml-1">
                  닉네임
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  placeholder="닉네임 입력"
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                    errors.nickname
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-[#EE4B6F]"
                  }`}
                  onChange={handleChange}
                />
                {errors.nickname && (
                  <p className="text-xs text-red-500 ml-1 mt-1">
                    {errors.nickname}
                  </p>
                )}
              </div>
            </div>

            {/* 이메일 & 인증번호 */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 ml-1">
                이메일 인증
              </label>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="example@email.com"
                    className={`flex-1 bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-[#EE4B6F]"
                    }`}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="bg-[#EE4B6F] hover:bg-[#D63A5C] text-white px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-md shadow-pink-200"
                  >
                    인증번호 전송
                  </button>
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 ml-1">{errors.email}</p>
                )}
              </div>

              <input
                type="text"
                name="authCode"
                value={formData.authCode}
                placeholder="인증번호 입력"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#EE4B6F] transition-all"
                onChange={handleChange}
              />
            </div>

            {/* 전화번호 */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">
                전화번호
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                placeholder="(-)를 제외한 숫자만 입력"
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-[#EE4B6F]"
                }`}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 ml-1 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 ml-1">
                보안 설정
              </label>
              <div className="space-y-1">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="비밀번호 (영문, 숫자, 특수문자 포함 8-20자)"
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-[#EE4B6F]"
                  }`}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 ml-1">{errors.password}</p>
                )}
              </div>

              <div className="space-y-1">
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  placeholder="비밀번호 재확인"
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                    errors.passwordConfirm
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-[#EE4B6F]"
                  }`}
                  onChange={handleChange}
                />
                {errors.passwordConfirm && (
                  <p className="text-xs text-red-500 ml-1">
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>
            </div>

            {/* 생년월일 */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">
                생년월일
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  name="birthYear"
                  value={formData.birthYear}
                  placeholder="년(YYYY)"
                  className={`bg-gray-50 border rounded-xl px-3 py-3 text-sm text-center focus:outline-none ${
                    errors.birthYear
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-[#EE4B6F]"
                  }`}
                  onChange={handleChange}
                />

                {/* 월 입력 (에러 표시 포함) */}
                <div className="relative">
                  <input
                    type="text"
                    name="birthMonth"
                    value={formData.birthMonth}
                    placeholder="월"
                    className={`w-full bg-gray-50 border rounded-xl px-3 py-3 text-sm text-center focus:outline-none ${
                      errors.birthMonth
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-[#EE4B6F]"
                    }`}
                    onChange={handleChange}
                  />
                </div>

                {/* 일 입력 (에러 표시 포함) */}
                <div className="relative">
                  <input
                    type="text"
                    name="birthDay"
                    value={formData.birthDay}
                    placeholder="일"
                    className={`w-full bg-gray-50 border rounded-xl px-3 py-3 text-sm text-center focus:outline-none ${
                      errors.birthDay
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-[#EE4B6F]"
                    }`}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* 생년월일 에러 메시지 통합 표시 */}
              {(errors.birthYear || errors.birthMonth || errors.birthDay) && (
                <p className="text-xs text-red-500 ml-1 mt-1">
                  {errors.birthYear || errors.birthMonth || errors.birthDay}
                </p>
              )}
            </div>

            {/* 성별 선택 */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">
                성별
              </label>
              <div className="flex bg-gray-100 rounded-xl p-1">
                {["M", "F"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGenderSelect("gender", g)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                      formData.gender === g
                        ? "bg-white text-[#EE4B6F] shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {g === "M" ? "남성" : "여성"}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="w-full md:w-1/2 bg-gray-50/50 p-8 md:p-12 border-l border-gray-100 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-lg font-bold text-gray-800">
                  프로필 사진
                </label>
                <span className="text-xs text-[#EE4B6F] font-medium bg-pink-50 px-2 py-1 rounded-md border border-pink-100">
                  최소 2장 필수
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="aspect-[3/4] relative group">
                    <label
                      className={`w-full h-full rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 border-dashed overflow-hidden ${img ? "border-transparent bg-gray-200" : "border-gray-300 hover:border-[#EE4B6F] bg-white hover:bg-pink-50/30"}`}
                    >
                      {img ? (
                        <>
                          <img
                            src={img.preview}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeImage(idx);
                              }}
                              className="text-white bg-red-500/80 rounded-full p-2 hover:bg-red-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-300 group-hover:text-[#EE4B6F] transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, idx)}
                          />
                        </>
                      )}
                      {/* 수정된 숫자 정렬 부분: flex, justify-center, items-center, leading-none 사용 */}
                      <div
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-medium backdrop-blur-sm leading-none pb-[1px] ${
                          idx === 0 ? "bg-[#EE4B6F]" : "bg-black/50"
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                * 나를 가장 잘 나타내는 사진을 첫 번째 사진으로 등록해보세요.
                <br />* 4장 이상 등록 시 매칭 확률이 올라갑니다.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                보고 싶은 성별
              </label>
              <div className="flex gap-2">
                {[
                  { k: "M", l: "남성" },
                  { k: "F", l: "여성" },
                  { k: "ALL", l: "모두" },
                ].map((opt) => (
                  <button
                    key={opt.k}
                    type="button"
                    onClick={() => handleGenderSelect("targetGender", opt.k)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border-1 transition-all ${
                      formData.targetGender === opt.k
                        ? "border-[#EE4B6F] text-[#EE4B6F] bg-[#EE4B6F]/5"
                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">
                  내가 찾는 관계
                </label>
                <button
                  type="button"
                  onClick={() => setIsRelationModalOpen(true)}
                  className={`w-full h-[52px] bg-white rounded-xl border transition-all flex items-center justify-center gap-1 text-sm ${
                    formData.relation
                      ? "border-[#EE4B6F] text-[#EE4B6F] font-bold bg-pink-50/10"
                      : "border-gray-200 text-gray-500 hover:border-[#EE4B6F] hover:text-[#EE4B6F]"
                  }`}
                >
                  {formData.relation ? (
                    // 선택된 값이 있으면 "선택 완료" 표시 (혹은 라벨을 찾아서 보여줄 수도 있음)
                    <span>{formData.relation}</span>
                  ) : (
                    <>
                      <span className="text-lg">+</span> 관계 추가
                    </>
                  )}
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500">
                  관심사
                </label>
                <button
                  type="button"
                  onClick={() => setIsInterestModalOpen(true)} // 클릭 이벤트 추가
                  className={`w-full h-[52px] bg-white rounded-xl border transition-all flex items-center justify-center gap-1 text-sm ${
                    formData.interests.length > 0
                      ? "border-[#EE4B6F] text-[#EE4B6F] font-bold bg-pink-50/10"
                      : "border-gray-200 text-gray-500 hover:border-[#EE4B6F] hover:text-[#EE4B6F]"
                  }`}
                >
                  {/* 선택된 개수에 따라 텍스트 다르게 보여주기 */}
                  {formData.interests.length > 0 ? (
                    <span>{formData.interests.length}개 선택됨</span>
                  ) : (
                    <>
                      <span className="text-lg">+</span> 관심사 추가
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-[#EE4B6F] to-[#FF6B6B] text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
            >
              가입 신청
            </button>
            <div className="text-center text-sm text-gray-500">
              이미 계정이 있으신가요?{" "}
              <a
                href="/login"
                className="text-[#EE4B6F] font-bold ml-1 hover:underline"
              >
                로그인하기
              </a>
            </div>
          </div>
        </div>
      </div>

      {isInterestModalOpen && (
        <InterestEditModal
          allInterestOptions={INTEREST_LIST} // 전체 리스트 넘겨주기
          currentInterests={formData.interests} // 현재 선택된 리스트 넘겨주기
          onClose={() => setIsInterestModalOpen(false)} // 닫기 기능
          onSave={handleInterestSave} // 저장 기능
        />
      )}

      {isRelationModalOpen && (
        <RelationModal
          currentRelation={formData.relation}
          onClose={() => setIsRelationModalOpen(false)}
          onSave={handleRelationSave}
        />
      )}
    </div>
  );
};

export default SignupPage;
