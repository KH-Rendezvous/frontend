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
import ChatPage from "./pages/chat/ChatPage";
import MatchingPage from "./pages/matching/MatchingPage";

// ★ 레이아웃 컴포넌트 임포트 (경로 확인 필수!)
import MainLayout from "./layouts/MainLayout";
import PlacesDetail from "./components/support/PlacesDetail";
import ServiceIntro from "./components/policy/ServiceIntro";
import UserGuide from "./components/policy/UserGuide";
import Policy from "./components/policy/Privacy";
import Privacy from "./components/policy/Privacy";
import Terms from "./components/policy/Terms";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signIn" element={<LoginPage />} />

      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/myPage" element={<MyPage />} />

      {/* footer에 포함된 컨텐츠들 */}
      <Route path="/service-intro" element={<ServiceIntro />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/user-guide" element={<UserGuide />} />
      <Route path="/terms" element={<Terms />} />

      <Route element={<MainLayout />}>
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/matching" element={<MatchingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/ai-manager" element={<AiManager />} />
        <Route path="/places" element={<Places />} />
        <Route path="/places/:id" element={<PlacesDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
