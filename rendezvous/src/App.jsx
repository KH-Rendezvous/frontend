import { Route, Routes } from "react-router-dom";
import "./index.css";

// 페이지 컴포넌트들
import HomePage from "./pages/home/HomePage";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import SignupPending from "./components/user/signup/SignupPending";
import AdminPage from "./pages/admin/AdminPage";
import MyPage from "./pages/myPage/MyPage";
import DiscoveryPage from "./pages/discovery/DiscoveryPage";
import AiManager from "./components/support/AiManager";
import Places from "./components/support/Places";
import ChatPage from "./pages/chat/ChatPage";
import MatchingPage from "./pages/matching/MatchingPage";

// 레이아웃 & 정책
import MainLayout from "./layouts/MainLayout";
import PlacesDetail from "./components/support/PlacesDetail";
import ServiceIntro from "./components/policy/ServiceIntro";
import UserGuide from "./components/policy/UserGuide";
import Policy from "./components/policy/Privacy";
import Privacy from "./components/policy/Privacy";
import Terms from "./components/policy/Terms";
import PrivateRoute from "./components/auth/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* ======================================================== */}
      {/* [1] 누구나 접속 가능한 페이지 (Public) */}
      {/* ======================================================== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/signIn" element={<Login />} />
      <Route path="/signUp" element={<Signup />} />
      <Route path="/signup-pending" element={<SignupPending />} />

      {/* Footer 컨텐츠들 */}
      <Route path="/service-intro" element={<ServiceIntro />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/user-guide" element={<UserGuide />} />
      <Route path="/terms" element={<Terms />} />

      {/* ======================================================== */}
      {/* [2] 로그인 해야만 접속 가능한 페이지 (Private) */}
      {/* ======================================================== */}

      <Route element={<PrivateRoute />}>
        {/* 2-1. 단독 페이지 (레이아웃 없음) */}
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/admin/*" element={<AdminPage />} />

        {/* 2-2. MainLayout을 쓰는 페이지들 */}
        <Route element={<MainLayout />}>
          <Route path="/discovery" element={<DiscoveryPage />} />
          <Route path="/ai-manager" element={<AiManager />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:id" element={<PlacesDetail />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/matching" element={<MatchingPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
