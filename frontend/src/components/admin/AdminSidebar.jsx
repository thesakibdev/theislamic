import { useState } from "react";
import { FaTachometerAlt, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ArrowDown from "../../assets/icon/arrow-down.png";
import OpenBook from "../../assets/icon/open_book.png";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const activePath = window.location.pathname.split("/")[2];

  const [openQuran, setOpenQuran] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      name: "Comments",
      link: "comments",
    },
    {
      name: "Account",
      link: "account",
    },
    {
      name: "Theme",
      link: "theme",
    },
    // {
    //   name: "About Us",
    //   link: "about-us",
    // },
  ];

  const handleClick = (link) => {
    navigate(link);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button - Sticky */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="bg-primary text-white p-2 rounded-md shadow-lg"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <aside className="bg-primary text-white w-64 h-full flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 mb-6 p-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-lg md:text-xl">S</span>
            </div>
            <span className="text-lg md:text-xl font-bold">Surah</span>
          </div>

          {/* Menu Section */}
          <div className="mb-6 pl-4 md:pl-12 flex-1 overflow-y-auto">
            <div
              className={`flex items-center space-x-2 mb-4 cursor-pointer p-2 rounded hover:bg-primary/80`}
              onClick={() => handleClick("dashboard")}
            >
              <FaTachometerAlt
                className={`text-lg md:text-xl ${
                  activePath === "dashboard" ? "text-black/50" : "text-white"
                }`}
              />
              <span className="text-base md:text-lg font-semibold">Dashboard</span>
            </div>

            <h2 className="text-sm md:text-base capitalize font-bold mb-4 px-2">Menu</h2>

            <div className="mb-5">
              {/* quran menu list */}
              <div>
                <div
                  className="flex items-center justify-between pr-4 my-4 cursor-pointer p-2 rounded hover:bg-primary/80"
                  onClick={() => setOpenQuran(!openQuran)}
                >
                  <div className="flex items-center space-x-2">
                    <img src={OpenBook} alt="Open Book" className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-base md:text-lg font-semibold">Quran</span>
                  </div>
                  <img 
                    src={ArrowDown} 
                    alt="Arrow Down" 
                    className={`w-4 h-4 transition-transform ${openQuran ? 'rotate-180' : ''}`}
                  />
                </div>
                <div className={openQuran ? "block" : "hidden"}>
                  <ul className="flex flex-col gap-3">
                    <li
                      className="flex items-center space-x-2 text-sm md:text-base cursor-pointer pl-4 border-b pb-3 hover:bg-primary/60 rounded"
                      onClick={() => {
                        navigate("quran");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <div
                        className={`w-3 h-3 md:w-4 md:h-4 ${
                          activePath === "quran" ? "bg-black" : "bg-white"
                        } rounded-full`}
                      ></div>
                      <span>Quran</span>
                    </li>
                    <li
                      className="flex items-center space-x-2 text-sm md:text-base cursor-pointer pl-4 border-b pb-3 hover:bg-primary/60 rounded"
                      onClick={() => {
                        navigate("verses-other-data");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <div
                        className={`w-3 h-3 md:w-4 md:h-4 ${
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

            <ul className="flex flex-col gap-3">
              {headerMenu.map((item, index) => (
                <li key={index}>
                  <div
                    className="flex items-center space-x-2 text-base md:text-lg cursor-pointer p-2 rounded hover:bg-primary/80"
                    onClick={() => handleClick(item.link)}
                  >
                    <div
                      className={`w-4 h-4 md:w-6 md:h-6 ${
                        activePath === item.link ? "bg-black" : "bg-white"
                      } rounded-full`}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
