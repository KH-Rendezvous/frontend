// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  // 본인의 config 값으로 유지
  apiKey: "AIzaSyAEMXZ5UIm2yPWBDdsjw9J0oA1vxZSXiEc",
  authDomain: "rendezvous-8668c.firebaseapp.com",
  projectId: "rendezvous-8668c",
  storageBucket: "rendezvous-8668c.firebasestorage.app",
  messagingSenderId: "89860738721",
  appId: "1:89860738721:web:f86c4a7453536d2735eae0",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 백그라운드 메시지 수신 시 브라우저 알림 강제 호출
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] 백그라운드 메시지 수신: ", payload);

  const notificationTitle = payload.notification.title || "새로운 문의";
  const notificationOptions = {
    body: payload.notification.body || "문의 내용이 도착했습니다.",
    icon: "/logo.png", // 실제 로고 경로 확인
    badge: "/logo.png",
    tag: "support-alert", // 같은 태그는 알림이 겹치지 않게 함
  };

  // ★ 이 부분이 있어야 우측 하단에 알림이 뜹니다.
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
