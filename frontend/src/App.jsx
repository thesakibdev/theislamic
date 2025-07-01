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
// import { useDispatch, useSelector } from "react-redux";
import ClientLayout from "./layout/client/ClientLayout";
import VersesOtherData from "./pages/admin/VersesData";
import Blog from "./pages/admin/Blog";
import IndexPage from "./pages/client/Index";
import RecitePage from "./pages/client/Recite";
import ReciteLayout from "./layout/client/ReciteLayout";
import AuthProfile from "./components/client/AuthProfile";
import DonorPage from "./pages/client/Donor";
import HadithReadPage from "./pages/client/hadith/HadithReadPage";
import HadithPage from "./pages/client/hadith/HadithPage";
import HadithIndex from "./pages/client/hadith/HadithIndex";
import HadithThematic from "./pages/client/hadith/HadithThematic";
import Farewell from "./pages/client/hadith/Farewell";
import EmailVerify from "./pages/client/EmailVerify";
import DonateCheckout from "./pages/client/DonateCheckout";
import BlogDetails from "./pages/client/blog/BlogDetails";
import Blogs from "./pages/client/blog/Blogs";
import Translation from "./pages/client/Translation";
import Dashboard from "./pages/admin/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./slices/authslice";
// import { Skeleton } from "./components/ui/skeleton";
import SearchResult from "./pages/client/SearchResult";
import TafsirIndexPage from "./pages/client/tafsir/TafsirIndex";
import TafsirPage from "./pages/client/tafsir/TafsirPage";
import Accounting from "./pages/admin/Accounting";

export default function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoading) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  //     </div>
  //   );
  // }

  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search-results" element={<SearchResult />} />
        <Route path="/index" element={<IndexPage />} />
        <Route path="/translation" element={<Translation />} />
        <Route path="/profile" element={<AuthProfile />} />
        <Route path="/tafsir" element={<TafsirIndexPage />} />
        <Route path="/tafsir/:surahNumber" element={<TafsirPage />} />
        <Route path="/" element={<ReciteLayout />}>
          <Route path="/recite/:number" element={<RecitePage />} />
        </Route>
        {/* hadith */}
        <Route path="/hadith" element={<HadithPage />} />
        <Route path="/hadith/:id" element={<HadithIndex />} />
        <Route path="/hadith/:id/:number" element={<HadithReadPage />} />
        <Route path="/hadith/thematic" element={<HadithThematic />} />
        <Route path="/hadith/farewell" element={<Farewell />} />

        {/* donor route */}
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
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="quran" element={<Quran />} />
        <Route path="verses-other-data" element={<VersesOtherData />} />
        <Route path="hadith" element={<Hadith />} />
        <Route path="tafsir" element={<Tafsir />} />
        <Route path="donors" element={<Donors />} />
        <Route path="i-wall" element={<Blog />} />
        <Route path="accounting" element={<Accounting />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
