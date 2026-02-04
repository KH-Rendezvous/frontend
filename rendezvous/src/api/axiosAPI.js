import axios from "axios";

export const axiosApi = axios.create({
  // baseURL: "192.168.32.8"
  baseURL: "http://localhost:80", // 기본 URL 설정
  withCredentials: true, // 쿠키 전달을 위해 필요
});
