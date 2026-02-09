import axios from "axios";

export const axiosApi = axios.create({
  // 환경변수 불러오기 (없으면 로컬호스트 기본값)
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:80",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// =================================================================
// 요청 인터셉터: Access Token 자동 삽입
// =================================================================
axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// =================================================================
// 응답 인터셉터: 토큰 만료 처리 (줄 세우기 로직 추가)
// =================================================================
let isRefreshing = false; // 현재 토큰 갱신 중인지 체크하는 플래그
let refreshSubscribers = []; // 토큰 갱신 대기 중인 요청들을 담아둘 배열

// 대기 중인 요청들에게 새 토큰을 나눠주는 함수
const onRefreshed = (accessToken) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

// 대기열에 요청을 추가하는 함수
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

axiosApi.interceptors.response.use(
  (response) => response, // 성공 시 그대로 통과
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 아직 재시도 안 한 요청이라면
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // 이미 다른 요청이 토큰 갱신을 진행 중이라면 -> 대기열에 합류
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((accessToken) => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            resolve(axiosApi(originalRequest));
          });
        });
      }

      // 내가 처음으로 401을 띄운 요청이라면 -> 깃발 들고 총대 멤
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔥 토큰 만료됨! 재발급 시도 중...");

        const refreshToken =
          localStorage.getItem("refreshToken") ||
          sessionStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("리프레시 토큰 없음");
        }

        // 백엔드에 새 토큰 요청
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/member/refresh`,
          { refreshToken: refreshToken },
        );

        console.log("✅ 새 토큰 발급 완료");

        // 1. 새 토큰 저장
        localStorage.setItem("accessToken", data.accessToken);

        // 2. 갱신 중 플래그 해제
        isRefreshing = false;

        // 3. 대기 중이던 다른 요청들 실행 (새 토큰 전달)
        onRefreshed(data.accessToken);

        // 4. 내 원래 요청 재실행
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosApi(originalRequest);
      } catch (refreshError) {
        console.error("⛔ 토큰 갱신 실패 (로그아웃):", refreshError);
        isRefreshing = false;
        refreshSubscribers = []; // 대기열 비우기

        localStorage.clear();
        sessionStorage.clear();
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/signIn";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
