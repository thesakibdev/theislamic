import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthLayout from "./layout/auth/AuthLayout";
import Registration from "./components/auth/Registration";
import Login from "./components/auth/Login";
import AdminLayout from "./layout/admin/AdminLayout";
import Quran from "./pages/admin/Quran";
import NotFound from "./pages/404";
import Tafsir from "./pages/admin/Tafsir";
import Hadith from "./pages/admin/Hadith";
import Donors from "./pages/admin/Donors";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* auth Register and Login route */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="/signup" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" />
        <Route path="quran" element={<Quran />} />
        <Route path="hadith" element={<Hadith />} />
        <Route path="tafsir" element={<Tafsir />} />
        <Route path="donors" element={<Donors />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
