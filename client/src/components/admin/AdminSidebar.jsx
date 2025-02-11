import { useState } from "react";
import { FaTachometerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const headerMenu = [
    {
      name: "Quran",
      link: "quran",
    },
    {
      name: "Verses Other Data",
      link: "verses-other-data",
    },
    // {
    //   name: "Hadith",
    //   link: "hadith",
    // },
    // {
    //   name: "Tafsir",
    //   link: "tafsir",
    // },
    // {
    //   name: "Salat",
    //   link: "salat",
    // },
    // {
    //   name: "I-Wall",
    //   link: "i-wall",
    // },
    // {
    //   name: "Donors",
    //   link: "donors",
    // },
    // {
    //   name: "About Us",
    //   link: "about-us",
    // },
  ];

  const [activeLink, setActiveLink] = useState("quran");

  const handleClick = (link) => {
    setActiveLink(link);
    navigate(link);
  };

  return (
    <div>
      <aside className="bg-primary text-white w-64 h-full flex flex-col">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 mb-6">
          <img
            src="https://i.ibb.co.com/DMXxN5B/admin-header.png"
            alt="Surah Logo"
          />
        </div>

        {/* Menu Section */}
        <div className="mb-6 pl-12">
          <div className="flex items-center space-x-2 mb-4">
            <FaTachometerAlt className="text-lg" />
            <span className="text-lg font-semibold">Dashboard</span>
          </div>

          <h2 className="text-base capitalize font-bold mb-4">Menu</h2>
          <ul className="flex flex-col gap-5">
            {headerMenu.map((item, index) => (
              <li key={index}>
                <div
                  className="flex items-center space-x-2 text-lg cursor-pointer"
                  onClick={() => handleClick(item.link)}
                >
                  <div
                    className={`w-6 h-6 ${
                      activeLink === item.link ? "bg-black" : "bg-white"
                    } rounded-full`}
                  ></div>
                  <span>{item.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Theme Section */}
        <div className="pl-12">
          <h2 className="text-base capitalize font-bold mb-2">Theme</h2>

          <div className="flex flex-col gap-5">
            <button className="flex items-center space-x-2 text-lg">
              <div className="w-6 h-6 bg-white rounded-full"></div>
              <span>Dark</span>
            </button>
            <button className="flex items-center space-x-2 text-lg">
              <div className="w-6 h-6 bg-white rounded-full"></div>
              <span>Light</span>
            </button>
            <button className="flex items-center space-x-2 text-lg">
              <div className="w-6 h-6 bg-white rounded-full"></div>
              <span>Blue</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
