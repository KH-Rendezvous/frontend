import { Route, Routes } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/user/LoginPage";
import AdminPage from "./pages/admin/AdminPage";
import MyPage from "./pages/myPage/MyPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signIn" element={<LoginPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/myPage" element={<MyPage />} />
    </Routes>
  );
}

export default App;