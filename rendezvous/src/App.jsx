import { Route, Routes } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/user/LoginPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminReportDetail from "./components/admin/AdminReportDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signIn" element={<LoginPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/report/:id" element={<AdminReportDetail />} />
    </Routes>
  );
}

export default App;
