import axios from "axios";

export const axiosApi = axios.create({
  baseURL: "http://192.168.32.8",
  withCredentials: true, // 쿠키 전달을 위해 필요
});
