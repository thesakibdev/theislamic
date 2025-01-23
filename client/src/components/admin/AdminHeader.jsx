import { useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useLocation } from "react-router-dom";

export default function AdminHeader() {
  const [isProfileOpen, setisProfileOpen] = useState(false);
  const [isNotificationOpen, setisNotificationOpen] = useState(false);
  const toggleProfile = () => {
    setisProfileOpen(!isProfileOpen);
  };

  const toggleNotification = () => {
    setisNotificationOpen(!isNotificationOpen);
  };

  const notifications = [
    "New comment on your post",
    "New like on your photo",
    "Someone mentioned you in a comment",
    "You have a new follower",
  ];
  const location = useLocation();
  const breadcrumb = location.pathname.split("/").filter(Boolean);
  return (
    <header className="bg-primary flex justify-between items-center px-12 py-6 text-white">
      {/* Left Section */}
      <div className="text-xl font-regular font-sans capitalize">
        {" "}
        {breadcrumb[0]} / {breadcrumb[1]}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Keywords"
            className="px-4 py-2 rounded-full bg-adminInput outline-none text-black"
          />
          <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative cursor-pointer" onClick={toggleNotification}>
          <FaBell className="text-xl" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1">
            {notifications.length}
          </span>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute top-8 right-0 w-64 bg-white shadow-lg rounded-lg p-2 mt-2 z-10">
              <ul>
                {notifications.length === 0 ? (
                  <li className="text-center text-sm text-gray-500">
                    No new notifications
                  </li>
                ) : (
                  notifications.map((notification, index) => (
                    <li
                      key={index}
                      className="py-2 px-4 text-black text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {notification}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
        {/* user */}
        <div className="relative">
          <div
            onClick={toggleProfile}
            className="flex transition-all items-center cursor-pointer space-x-2"
          >
            <img
              src="https://images.unsplash.com/photo-1612766959025-ac18e2b3bb96?crop=entropy&cs=srgb&fm=jpg&ixid=M3w2NjMyNTh8MHwxfHNlYXJjaHw5fHxmb3JtYWx8ZW58MHx8fHwxNzM3MjI5NzMyfDA&ixlib=rb-4.0.3&q=85"
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span>Rohan Ahmed</span>
            <IoMdArrowDropdown className="text-2xl" />
          </div>
          {isProfileOpen && (
            <div className="absolute transition-all origin-top duration-300 ease-in-out right-0 mt-2 w-48 bg-primary shadow-lg rounded-lg">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 hover:text-slate-900 cursor-pointer">
                  Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 hover:text-slate-900 cursor-pointer">
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
