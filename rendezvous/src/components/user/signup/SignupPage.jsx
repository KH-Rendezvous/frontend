import React, { useState, useEffect } from "react";
import InterestEditModal from "../../myPage/modals/InterestEditModal";
import RelationModal from "../signup/RelationModal";
import { axiosApi } from "../../../api/axiosAPI";
import { useNavigate } from "react-router-dom";

const INTEREST_LIST = [
  "MBTI",
  "맛집 탐방",
  "넷플릭스",
  "해외여행",
  "산책",
  "카페 투어",
  "헬스",
  "드라이브",
  "호캉스",
  "반려동물",
  "영화 감상",
  "와인/위스키",
  "전시회 관람",
  "유튜브",
  "테니스/골프",
  "주식/재테크",
  "온라인 게임",
  "캠핑/차박",
  "자기계발",
  "페스티벌",
  "코인 노래방",
  "진지한 대화",
  "쇼핑",
  "러닝",
  "독서",
  "보드게임",
  "워라밸",
  "요리",
  "사진 촬영",
  "자취",
  "콘솔 게임",
  "낚시",
  "직장생활",
  "스터디",
  "피아노",
  "명상",
  "여행",
  "클라이밍",
  "언어 교환",
  "웹툰",
];

const SignupPage = () => {
  const navigate = useNavigate();

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    authKey: "",
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

  const [isLocationAgreed, setIsLocationAgreed] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0); // 남은 시간 (초)
  const [resendCooldown, setResendCooldown] = useState(0); // 재전송 쿨타임 (초)
  const [isVerified, setIsVerified] = useState(false); // 인증 완료 여부
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState(Array(6).fill(null));

  const isFormValid =
    // 1. 이메일 인증 & 위치 약관
    isVerified &&
    isLocationAgreed &&
    // 2. 이미지 최소 2장
    images.filter((img) => img !== null).length >= 2 &&
    // 3. 에러 메시지가 하나도 없어야 함
    Object.values(errors).every((msg) => !msg) &&
    // 4. 필수 텍스트 필드들이 다 채워져 있어야 함
    formData.name &&
    formData.nickname &&
    formData.phone &&
    formData.password &&
    formData.passwordConfirm &&
    formData.birthYear &&
    formData.birthMonth &&
    formData.birthDay &&
    formData.gender &&
    formData.targetGender &&
    formData.relation &&
    // 5. 비밀번호 일치 & 관심사 선택
    formData.password === formData.passwordConfirm &&
    formData.interests.length > 0;

  // 관심사 저장 핸들러 (모달에서 저장 버튼 눌렀을 때 실행됨)
  const handleInterestSave = (selectedInterests) => {
    setFormData((prev) => ({ ...prev, interests: selectedInterests }));
    setIsInterestModalOpen(false);
  };

  // 저장 핸들러 추가
  const handleRelationSave = (selectedId) => {
    setFormData((prev) => ({ ...prev, relation: selectedId }));
    setIsRelationModalOpen(false);
  };

  useEffect(() => {
    // 둘 중 하나라도 시간이 남아있으면 타이머 돌아감
    if ((timeLeft > 0 || resendCooldown > 0) && !isVerified) {
      const timerId = setInterval(() => {
        // 5분 타이머 줄이기
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        // 30초 쿨타임 줄이기
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [timeLeft, resendCooldown, isVerified]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleSendEmail = async () => {
    if (!formData.email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (errors.email) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (resendCooldown > 0) {
      alert(`잠시 후 다시 시도해주세요. (${resendCooldown}초 남음)`);
      return;
    }

    try {
      const checkRes = await axiosApi.get("/api/member/check", {
        params: { type: "email", value: formData.email },
      });

      if (checkRes.data === 1) {
        setErrors((prev) => ({
          ...prev,
          email: "이미 사용 중인 이메일입니다.",
        }));
        alert("이미 가입된 이메일입니다.");
        return;
      }

      const response = await axiosApi.post("/api/email/signup", {
        email: formData.email,
      });

      if (response.status === 200 && response.data === 1) {
        alert("인증번호가 전송되었습니다.\n최대 30초 소요될 수 있습니다.");

        setTimeLeft(300);
        setResendCooldown(30);
        setIsVerified(false);
        setIsEmailSent(true);
      } else {
        alert("메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Email Send Error:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  // 인증번호 확인 핸들러
  const handleCheckAuthKey = async () => {
    if (!formData.email || !formData.authKey) {
      alert("이메일과 인증번호를 모두 입력해주세요.");
      return;
    }

    // 시간 초과 체크
    if (timeLeft === 0) {
      alert("인증 시간이 만료되었습니다. 다시 전송해주세요.");
      return;
    }

    try {
      const response = await axiosApi.post("/api/email/check", {
        email: formData.email,
        authKey: formData.authKey,
      });

      if (response.status === 200 && response.data === 1) {
        // 인증 성공
        setIsVerified(true);
        setTimeLeft(0);
        setErrors((prev) => ({ ...prev, authKey: null }));
        alert("인증이 완료되었습니다.");
      } else {
        // 인증 실패
        setIsVerified(false);
        alert("인증번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("Auth Check Error:", error);
      alert("인증 확인 중 오류가 발생했습니다.");
    }
  };

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

  const checkDuplicate = async (field, value) => {
    // 값이 없거나, 이미 정규식 에러가 떠 있으면 중복 검사 안 함 (서버 요청 아까움)
    if (!value || errors[field]) return;

    try {
      // 백엔드 API 호출 (GET /api/member/check?type=email&value=test@test.com)
      // 백엔드 컨트롤러에서 type에 따라 분기 처리해서 count(*) 결과를 1 또는 0으로 리턴해줘야 함
      const response = await axiosApi.get("/api/member/check", {
        params: { type: field, value: value },
      });

      // 중복이면(1이면) 에러 세팅
      if (response.data === 1) {
        setErrors((prev) => ({
          ...prev,
          [field]: `이미 사용 중인 ${field === "email" ? "이메일" : field === "nickname" ? "닉네임" : "전화번호"}입니다.`,
        }));
      }
    } catch (error) {
      console.error("중복 검사 실패:", error);
    }
  };

  // [추가] 포커스 나갈 때 실행될 함수
  const handleBlur = (e) => {
    const { name, value } = e.target;
    // 닉네임, 이메일, 전화번호만 검사
    if (["nickname", "email", "phone"].includes(name)) {
      checkDuplicate(name, value);
    }
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

      case "authKey":
        if (trimmedValue && trimmedValue.length < 6) {
          tempErrors.authKey = "인증번호 6자리를 모두 입력해주세요.";
        } else {
          delete tempErrors.authKey;
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
    if (name === "authKey") {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 0. 이미 제출 중이면 함수 종료 (더블 클릭 방지)
    if (isSubmitting || !isFormValid) return;

    // 1. 이메일 인증 완료 여부 검사
    if (!isVerified) {
      alert("이메일 인증을 완료해주세요.");
      document.querySelector('input[name="email"]').focus();
      return;
    }

    if (!isLocationAgreed) {
      alert("위치기반 서비스 이용약관에 동의해주세요.");
      return;
    }

    // 2. 이미지 검사: 유효한 이미지가 2장 이상인지 확인
    const validImages = images.filter((img) => img !== null);
    if (validImages.length < 2) {
      alert("프로필 사진은 최소 2장 이상 등록해야 합니다.");
      return;
    }

    // 3. 실시간 에러 검사
    const currentErrorMessages = Object.values(errors).filter((msg) => msg);
    if (currentErrorMessages.length > 0) {
      alert(
        "입력하신 정보를 다시 확인해주세요.\n(빨간색 에러 메시지를 해결해야 합니다)",
      );
      return;
    }

    // 4. 필수 입력값 검사
    const requiredFields = [
      { key: "email", label: "이메일" },
      { key: "authKey", label: "인증번호" },
      { key: "password", label: "비밀번호" },
      { key: "passwordConfirm", label: "비밀번호 확인" },
      { key: "name", label: "이름" },
      { key: "nickname", label: "닉네임" },
      { key: "phone", label: "전화번호" },
      { key: "birthYear", label: "생년" },
      { key: "birthMonth", label: "생월" },
      { key: "birthDay", label: "생일" },
      { key: "gender", label: "성별" },
      { key: "relation", label: "찾는 관계" },
    ];

    for (const field of requiredFields) {
      const value = formData[field.key];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        alert(`${field.label}을(를) 입력해주세요.`);
        return;
      }
    }

    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.interests.length === 0) {
      alert("관심사를 최소 1개 이상 선택해주세요.");
      return;
    }

    // --- 검사 통과: 전송 시작 ---

    // 5. 로딩 시작 (버튼 비활성화 효과)
    setIsSubmitting(true);

    const fixedMonth = formData.birthMonth.padStart(2, "0");
    const fixedDay = formData.birthDay.padStart(2, "0");

    const finalFormData = {
      ...formData,
      birthMonth: fixedMonth,
      birthDay: fixedDay,
    };

    const submitData = new FormData();
    const { passwordConfirm, ...rest } = finalFormData;

    // JSON 데이터 추가
    const jsonBlob = new Blob([JSON.stringify(rest)], {
      type: "application/json",
    });
    submitData.append("data", jsonBlob);

    // 이미지 파일 추가
    validImages.forEach((img) => {
      if (img.file) {
        submitData.append("images", img.file);
      }
    });

    try {
      const response = await axiosApi.post("/api/member/signup", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === 1) {
        alert("가입 신청이 완료되었습니다!"); // 사용자에게 성공 알림
        navigate("/signup-pending");
      } else {
        alert("가입 처리에 실패했습니다. (관리자 문의)");
      }
    } catch (error) {
      console.error("Signup failed", error);
      const serverMsg = error.response?.data?.message;
      if (serverMsg) {
        alert(`가입 실패: ${serverMsg}`);
      } else {
        alert("서버 통신 중 오류가 발생했습니다.");
      }
    } finally {
      // 6. 성공하든 실패하든 로딩 상태 해제
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-10">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
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
                  onBlur={handleBlur}
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
                    readOnly={isVerified}
                    className={`flex-1 bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : isVerified
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 focus:border-[#EE4B6F]"
                    }`}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    // [수정] 버튼 비활성화 조건: 인증 완료됐거나 || 30초 쿨타임 중일 때
                    disabled={isVerified || resendCooldown > 0}
                    className={`px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-md ${
                      isVerified || resendCooldown > 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                        : "bg-[#EE4B6F] hover:bg-[#D63A5C] text-white shadow-pink-200"
                    }`}
                  >
                    {/* 버튼 텍스트 로직 변경 */}
                    {
                      isVerified
                        ? "인증 완료"
                        : resendCooldown > 0
                          ? `${resendCooldown}초 후 재전송` // 30초 카운트다운
                          : "인증번호 전송" // 평소 상태
                    }
                  </button>
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 ml-1">{errors.email}</p>
                )}
              </div>

              {/* 인증번호 입력란 + 확인 버튼 (레이아웃 변경) */}
              <div className="flex gap-2">
                <input
                  type="text"
                  name="authKey"
                  value={formData.authKey}
                  placeholder="인증번호 6자리"
                  readOnly={isVerified || timeLeft === 0} // 시간 끝나거나 인증되면 입력 불가
                  className={`flex-1 bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                    errors.authKey
                      ? "border-red-500 focus:border-red-500"
                      : isVerified
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 focus:border-[#EE4B6F]"
                  }`}
                  onChange={handleChange}
                />
                {/* 인증 확인 버튼 추가 */}
                <button
                  type="button"
                  onClick={handleCheckAuthKey}
                  disabled={isVerified || timeLeft === 0} // 이미 인증했거나 시간 끝났으면 비활성
                  className={`px-4 py-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-md ${
                    isVerified || timeLeft === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                      : "bg-gray-800 hover:bg-gray-900 text-white"
                  }`}
                >
                  확인
                </button>
              </div>

              {/* 메시지 영역: 타이머 or 성공 메시지 or 에러 메시지 */}
              <div className="ml-1 min-h-[20px]">
                {isVerified ? (
                  <p className="text-xs text-green-600 font-bold">
                    ✓ 인증이 완료되었습니다.
                  </p>
                ) : (
                  <>
                    {errors.authKey && (
                      <p className="text-xs text-red-500 mb-1">
                        {errors.authKey}
                      </p>
                    )}

                    {/* [수정] 여기는 여전히 5분 타이머(timeLeft)를 보여줌 */}
                    {timeLeft > 0 && !isVerified && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#EE4B6F] font-bold">
                          남은 시간: {formatTime(timeLeft)}
                        </span>
                        {/* 30초 지나면 팁을 띄워줄 수도 있음 */}
                        {resendCooldown === 0 && (
                          <span className="text-gray-400 text-[10px] ml-2">
                            인증번호가 안 오나요? 재전송을 눌러보세요.
                          </span>
                        )}
                      </div>
                    )}

                    {/* 5분 지났을 때 메시지 */}
                    {timeLeft === 0 && !isVerified && isEmailSent && (
                      <p className="text-xs text-gray-400">
                        인증번호 유효시간이 만료되었습니다.
                      </p>
                    )}
                  </>
                )}
              </div>
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
                onBlur={handleBlur}
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
            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="locationAgree"
                checked={isLocationAgreed}
                onChange={(e) => setIsLocationAgreed(e.target.checked)}
                className="w-4 h-4 text-[#EE4B6F] border-gray-300 rounded focus:ring-[#EE4B6F] cursor-pointer"
              />
              <label
                htmlFor="locationAgree"
                className="text-xs text-gray-600 cursor-pointer select-none"
              >
                <span className="text-[#EE4B6F] font-bold">[필수]</span>{" "}
                위치기반 서비스 이용약관 동의
              </label>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="text-xs text-gray-400 underline hover:text-gray-600 ml-auto"
              >
                내용 보기
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
                !isFormValid || isSubmitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" // 비활성 스타일
                  : "bg-gradient-to-r from-[#EE4B6F] to-[#FF6B6B] text-white shadow-pink-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]" // 활성 스타일
              }`}
            >
              {isSubmitting ? "가입 처리 중..." : "가입 신청"}
            </button>
            <div className="text-center text-sm text-gray-500">
              이미 계정이 있으신가요?{" "}
              <a
                href="/signIn"
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
      {isLocationModalOpen && (
        <LocationTermModal onClose={() => setIsLocationModalOpen(false)} />
      )}
    </div>
  );
};

const LocationTermModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">
            위치기반 서비스 이용약관
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4">
          <p className="font-bold text-gray-800">제 1 조 (목적)</p>
          <p>
            본 약관은 Rendezvous(이하 "회사")가 제공하는 위치기반 서비스와
            관련하여 회사와 개인위치정보주체와의 권리, 의무 및 책임사항, 기타
            필요한 사항을 규정함을 목적으로 합니다.
          </p>

          <p className="font-bold text-gray-800 mt-4">
            제 2 조 (이용약관의 효력 및 변경)
          </p>
          <p>
            1. 본 약관은 서비스를 신청한 고객 또는 개인위치정보주체가 본 약관에
            동의하고 회사가 정한 소정의 절차에 따라 서비스의 이용자로
            등록함으로써 효력이 발생합니다.
            <br />
            2. 회원은 본 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할
            수 있으며, 약관에 동의하는 것은 회사가 위치정보를 수집, 이용,
            제공하는 것에 동의하는 것으로 간주합니다.
          </p>

          <p className="font-bold text-gray-800 mt-4">
            제 3 조 (위치정보 수집방법)
          </p>
          <p>
            회사는 다음과 같은 방식으로 개인위치정보를 수집합니다.
            <br />
            1. 휴대폰 단말기를 이용한 기지국 기반(Cell ID)의 실시간 위치정보
            수집
            <br />
            2. GPS칩이 내장된 전용 단말기를 통해 수집되는 GPS 정보
            <br />
            3. Wi-Fi 무선랜을 통해 수집되는 위치정보
          </p>

          <p className="font-bold text-gray-800 mt-4">
            제 4 조 (서비스의 내용)
          </p>
          <p>
            회사는 위치정보를 이용하여 다음과 같은 서비스를 제공합니다.
            <br />
            1. 내 주변 사용자 찾기 및 매칭 추천 서비스
            <br />
            2. 현재 위치를 기반으로 한 데이트 장소 추천
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#EE4B6F] hover:bg-[#D63A5C] text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-pink-100"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
