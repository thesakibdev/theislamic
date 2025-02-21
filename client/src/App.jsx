import { Route, Routes } from "react-router-dom";
import Home from "./pages/client/Home";
import AuthLayout from "./layout/auth/AuthLayout";
import Registration from "./components/auth/Registration";
import Login from "./components/auth/Login";
import AdminLayout from "./layout/admin/AdminLayout";
import Quran from "./pages/admin/Quran";
import NotFound from "./pages/404";
import Tafsir from "./pages/admin/Tafsir";
import Hadith from "./pages/admin/Hadith";
import Donors from "./pages/admin/Donors";
import CheckAuth from "./middleware/CheckAuth";
import { useSelector } from "react-redux";
import ClientLayout from "./layout/client/ClientLayout";
import VersesOtherData from "./pages/admin/VersesData";
import Blog from "./pages/admin/Blog";
import IndexPage from "./pages/client/Index";
import RecitePage from "./pages/client/Recite";
import ReciteLayout from "./layout/client/ReciteLayout";
import AuthProfile from "./components/client/AuthProfile";
import DonorPage from "./pages/client/Donor";
import HadithReadPage from "./pages/client/HadithReadPage";
import HadithPage from "./pages/client/HadithPage";
import HadithIndex from "./pages/client/HadithIndex";
import EmailVerify from "./pages/client/EmailVerify";
import DonateCheckout from "./pages/client/DonateCheckout";
import BlogDetails from "./pages/client/BlogDetails";
import Blogs from "./pages/client/Blogs";


export default function App() {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/index" element={<IndexPage />} />
        <Route path="/profile" element={<AuthProfile />} />
        <Route path="/" element={<ReciteLayout />}>
          <Route path="/recite/:number" element={<RecitePage />} />
        </Route>
        {/* hadith */}
        <Route path="/hadith" element={<HadithPage />} />
        <Route path="/hadith/:title" element={<HadithIndex />} />
        <Route path="/hadith/:title/:number" element={<HadithReadPage />} />
        {/* donor */}
        <Route path="/donor" element={<DonorPage />} />
        <Route path="/donate-checkout" element={<DonateCheckout />} />
        {/* blogs */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog-details" element={<BlogDetails />} />

      </Route>

      {/* auth Register and Login route */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="/signup" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerify />} />
      </Route>

      <Route
        path="/admin"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }
      >
        <Route path="dashboard" />
        <Route path="quran" element={<Quran />} />
        <Route path="verses-other-data" element={<VersesOtherData />} />
        <Route path="hadith" element={<Hadith />} />
        <Route path="tafsir" element={<Tafsir />} />
        <Route path="donors" element={<Donors />} />
        <Route path="i-wall" element={<Blog />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
