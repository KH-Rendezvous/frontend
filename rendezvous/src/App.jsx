import { Route, Routes } from "react-router-dom";
import "./index.css";

// 페이지 컴포넌트들
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/user/LoginPage";
import AdminPage from "./pages/admin/AdminPage";
import MyPage from "./pages/myPage/MyPage";
import DiscoveryPage from "./pages/discovery/DiscoveryPage"; // ※ 주의: 여기엔 사이드바가 없고 내용만 있어야 함
import AiManager from "./components/support/AiManager";
import Places from "./components/support/Places";

// ★ 레이아웃 컴포넌트 임포트 (경로 확인 필수!)
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signIn" element={<LoginPage />} />

      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/myPage" element={<MyPage />} />

      <Route element={<MainLayout />}>
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/ai-manager" element={<AiManager />} />
        <Route path="/places" element={<Places />} />
      </Route>
    </Routes>
  );
}

export default App;
