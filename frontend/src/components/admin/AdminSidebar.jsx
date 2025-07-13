import { useState } from "react";
import { FaTachometerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ArrowDown from "../../assets/icon/arrow-down.png";
import OpenBook from "../../assets/icon/open_book.png";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const activePath = window.location.pathname.split("/")[2];

  const [openQuran, setOpenQuran] = useState(false);

  const headerMenu = [
    {
      name: "Hadith",
      link: "hadith",
    },
    {
      name: "Tafsir",
      link: "tafsir",
    },
    // {
    //   name: "Salat",
    //   link: "salat",
    // },
    {
      name: "I-Wall",
      link: "i-wall",
    },
    {
      name: "Donors",
      link: "donors",
    },
    {
      name: "Account",
      link: "account",
    },
    // {
    //   name: "About Us",
    //   link: "about-us",
    // },
  ];

  const handleClick = (link) => {
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
          <div
            className={`flex items-center space-x-2 mb-4 cursor-pointer`}
            onClick={() => handleClick("dashboard")}
          >
            <FaTachometerAlt
              className={`text-xl ${
                activePath === "dashboard" ? "text-black/50" : "text-white"
              }  `}
            />
            <span className="text-lg font-semibold">Dashboard</span>
          </div>

          <h2 className="text-base capitalize font-bold mb-4">Menu</h2>

          <div className="mb-5">
            {/* quran menu list */}
            <div>
              <div
                className="flex items-center justify-between pr-4 my-4 cursor-pointer"
                onClick={() => setOpenQuran(!openQuran)}
              >
                <img src={OpenBook} alt="Open Book" />
                <span className="text-lg font-semibold">Quran</span>
                <img src={ArrowDown} alt="Arrow Down" />
              </div>
              <div className={openQuran ? "block" : "hidden"}>
                <ul className="flex flex-col gap-5">
                  <li
                    className="flex items-center space-x-2 text-md cursor-pointer pl-4 border-b pb-4"
                    onClick={() => {
                      navigate("quran");
                    }}
                  >
                    <div
                      className={`w-4 h-4 ${
                        activePath === "quran" ? "bg-black" : "bg-white"
                      } rounded-full`}
                    ></div>
                    <span>Quran</span>
                  </li>
                  <li
                    className="flex items-center space-x-2 text-md cursor-pointer pl-4 border-b pb-4"
                    onClick={() => {
                      navigate("verses-other-data");
                    }}
                  >
                    <div
                      className={`w-4 h-4 ${
                        activePath === "verses-other-data"
                          ? "bg-black"
                          : "bg-white"
                      } rounded-full`}
                    ></div>
                    <span>Verses-Other-Data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <ul className="flex flex-col gap-5">
            {headerMenu.map((item, index) => (
              <li key={index}>
                <div
                  className="flex items-center space-x-2 text-lg cursor-pointer"
                  onClick={() => handleClick(item.link)}
                >
                  <div
                    className={`w-6 h-6 ${
                      activePath === item.link ? "bg-black" : "bg-white"
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
            <button className="flex items-center space-x-2 text-lg">
              <div className="w-6 h-6 bg-white rounded-full"></div>
              <span>
                <a href="/" target="_blank">
                  Visit Website
                </a>
              </span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
