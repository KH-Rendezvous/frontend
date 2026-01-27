import { Route, Routes } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/user/LoginPage";
import AdminPage from "./pages/admin/AdminPage";
import MyPage from "./pages/myPage/MyPage";
import DiscoveryPage from "./pages/discovery/DiscoveryPage";
import AiManager from "./components/support/AiManager";
import Places from "./components/support/Places";
import QnA from "./components/support/QnA";
import Profile from "./components/support/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signIn" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/myPage" element={<MyPage />} />
      <Route path="discovery" element={<DiscoveryPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/ai-manager" element={<AiManager />} />
      <Route path="/places" element={<Places />} />
    </Routes>
  );
}

export default App;
