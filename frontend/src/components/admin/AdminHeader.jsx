import { checkAuth, logoutUser } from "@/slices/authslice";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminHeader() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const [isProfileOpen, setisProfileOpen] = useState(false);
  
  const toggleProfile = () => {
    setisProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/");
        toast.success("Logout successfully!");
      })
      .catch((error) => {
        toast.error("Logout failed: " + (error?.message || "Unknown error"));
      });
  };

  const location = useLocation();
  const breadcrumb = location.pathname.split("/").filter(Boolean);

  const initialAvatar = user?.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <header className="bg-primary flex justify-between items-center px-4 md:px-8 lg:px-12 py-4 md:py-6 text-white sticky top-0 z-30">
      {/* Left Section */}
      <div className="text-lg md:text-xl font-regular font-sans capitalize">
        {breadcrumb[0]} / {breadcrumb[1]}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 md:space-x-8">
        {/* User Profile */}
        <div className="relative">
          <div
            onClick={toggleProfile}
            className="flex transition-all items-center cursor-pointer space-x-2"
          >
            {user?.avatar ? (
              <img
                src="https://images.unsplash.com/photo-1612766959025-ac18e2b3bb96?crop=entropy&cs=srgb&fm=jpg&ixid=M3w2NjMyNTh8MHwxfHNlYXJjaHw5fHxmb3JtYWx8ZW58MHx8fHwxNzM3MjI5NzMyfDA&ixlib=rb-4.0.3&q=85"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full text-sm text-primary flex items-center justify-center">
                {initialAvatar}
              </div>
            )}
            <span className="hidden sm:block">{user?.name}</span>
            <IoMdArrowDropdown className="text-xl md:text-2xl" />
          </div>
          {isProfileOpen && (
            <div className="absolute transition-all origin-top duration-300 ease-in-out right-0 mt-2 w-48 bg-primary shadow-lg rounded-lg">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 hover:text-slate-900 cursor-pointer">
                  Profile
                </li>
                <li 
                  className="px-4 py-2 hover:bg-gray-100 hover:text-slate-900 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
