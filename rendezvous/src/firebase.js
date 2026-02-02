// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// ▼ 추가된 import: 알림(메시징) 관련 기능 불러오기
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEMXZ5UIm2yPWBDdsjw9J0oA1vxZSXiEc",
  authDomain: "rendezvous-8668c.firebaseapp.com",
  projectId: "rendezvous-8668c",
  storageBucket: "rendezvous-8668c.firebasestorage.app",
  messagingSenderId: "89860738721",
  appId: "1:89860738721:web:f86c4a7453536d2735eae0",
  measurementId: "G-Z2JZ8JWZCB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ▼ [중요] 메시징 초기화
const messaging = getMessaging(app);

// ▼ [필수] 아까 '클라우드 메시징' 탭에서 생성한 VAPID Key를 따옴표 안에 넣으세요!
const VAPID_KEY =
  "BNYFD7RSRhvuPBy5AxeoU9AL0gXVcjh0eohX18Bc3L7pAt0uQzI9SzYqTYa_1KImvTeEgLsPjat7PfM_9HAhcDQ";

// 1. 토큰 발급 함수 (관리자 페이지 켜질 때 실행)
export const requestPermissionAndGetToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // VAPID 키를 이용해 토큰 발급
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });

      // ★ 이 로그에 찍힌 토큰을 복사해서 백엔드(Java)에 넣어야 합니다!
      console.log("👇👇👇 [관리자 토큰] 복사해서 백엔드에 넣으세요 👇👇👇");
      console.log(token);

      return token;
    } else {
      console.log("알림 권한이 허용되지 않았습니다.");
      return null;
    }
  } catch (error) {
    console.error("토큰 발급 중 에러 발생:", error);
    return null;
  }
};

// 2. 포그라운드 메시지 수신 (관리자가 화면 보고 있을 때)
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("포그라운드 메시지 도착:", payload);

      // ▼▼▼ 보고 있을 때도 시스템 알림을 띄우는 코드 추가 ▼▼▼
      if (Notification.permission === "granted") {
        const { title, body } = payload.notification;

        // 브라우저 시스템 알림 강제 호출
        new Notification(title, {
          body: body,
          icon: "/logo.png", // 로고 경로 확인
        });
      }

      resolve(payload);
    });
  });
