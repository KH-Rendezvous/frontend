import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()], // ★ 이거 없으면 화면 다 깨짐 (CSS, JSX 인식 불가)

  server: {
    proxy: {
      // '/api'로 시작하는 요청은 스프링부트(백엔드)로 보냄
      "/api": {
        //target: "http://192.168.32.8:80",
        target: "http://localhost:80", // ★ 백엔드 포트번호 확인(80)
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
