// custom icon list
import HomeIcon from "../../assets/icon/home-icon.png";
import WorldIcon from "../../assets/icon/world-icon.png";
import SettingIcon from "../../assets/icon/settings-icon.png";
import AccountIcon from "../../assets/icon/account-icon.png";
import MenuIcon from "../../assets/icon/menu-icon.png";
import OpenBook from "../../assets/icon/open_book.png";
import Book from "../../assets/icon/book.png";
import Donate from "../../assets/icon/donate.png";
import Iwall from "../../assets/icon/i-wall.png";
import Social from "../../assets/icon/social.png";
import ManPraying from "../../assets/icon/man_praying.png";
import ManReading from "../../assets/icon/man_reading.png";
import ArrowDown from "../../assets/icon/arrow-down.png";

// components and use state
import { useSelector } from "react-redux";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  // menu related state
  const headerMenu = [
    {
      icon: HomeIcon,
      text: "Home",
      path: "/",
    },
    {
      icon: WorldIcon,
      text: "Language",
      path: "/",
    },
    {
      icon: SettingIcon,
      text: "Setting",
      path: "/",
    },
  ];

  const menuItems = [
    {
      icon: ManReading,
      text: "Tafsir",
      path: "/",
    },
    {
      icon: ManPraying,
      text: "Salat",
      path: "/",
    },
    {
      icon: Donate,
      text: "Donors",
      path: "/donor",
    },
    {
      icon: Iwall,
      text: "I-Wall",
      path: "/",
    },
    {
      icon: Social,
      text: "Social",
      path: "/",
    },
  ];

  const subMenuOne = [
    {
      text: "Index",
      path: "/index",
    },
    {
      text: "Recitation",
      path: "/recite/1",
    },
    {
      text: "Translation",
      path: "/translation",
    },
    {
      text: "Thematic",
      path: "/",
    },
    {
      text: "Exegesis",
      path: "/",
    },
    {
      text: "Word by Word",
      path: "/",
    },
  ];

  const subMenuTwo = [
    {
      text: "Index",
      path: "/hadith",
    },
    {
      text: "Thematic",
      path: "/hadith/thematic",
    },
    {
      text: "Farewell Sermon",
      path: "/hadith/farewell",
    },
  ];

  // user related state
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const roles = ["admin", "creator", "editor"];
  const initialAvatar = user?.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  // menu action related state
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdownMenu, setOpenDropdownMenu] = useState(false);
  const [openDropdownMenuTwo, setOpenDropdownMenuTwo] = useState(false);

  // all function
  const handleLogout = () => {
    localStorage.removeItem("user");
  };
  return (
    <header className={`bg-white shadow-md fixed w-full left-0 top-0 z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <span
              className="cursor-pointer"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <img src={MenuIcon} alt="The Islamics Center" />
            </span>
            <h1 className="text-xl font-bold text-primary">Islamics.com</h1>
          </div>
          <Sheet open={openMenu} onOpenChange={setOpenMenu}>
            <SheetContent side="left" className="w-[300px] px-0">
              <SheetHeader className="pl-4 -mt-4 pb-[25px]">
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>

              {/* dropdown menu item */}
              <div className="">
                {/* sub menu one */}
                <div className="hover:bg-gray-100 border-t-2 border-gray-400">
                  <div
                    className="flex items-center justify-between px-4 py-4 cursor-pointer"
                    onClick={() => setOpenDropdownMenu(!openDropdownMenu)}
                  >
                    <div className="flex items-center gap-2">
                      <img src={OpenBook} alt="Open Book" />
                      <span>Quran</span>
                    </div>
                    <img src={ArrowDown} alt="Arrow Down" />
                  </div>
                  <div className={openDropdownMenu ? "block" : "hidden"}>
                    <ul>
                      {subMenuOne.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-center px-4 py-4 cursor-pointer hover:bg-gray-100 border-t-2 border-gray-400"
                          onClick={() => {
                            navigate(item.path);
                            setOpenMenu(
                              !openMenu,
                              setOpenDropdownMenu(!openDropdownMenu)
                            );
                          }}
                        >
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* sub menu two */}
                <div className="hover:bg-gray-100 border-b-2 border-t-2 border-gray-400">
                  <div
                    className="flex items-center justify-between px-4 py-4 cursor-pointer"
                    onClick={() => setOpenDropdownMenuTwo(!openDropdownMenuTwo)}
                  >
                    <div className="flex items-center gap-2">
                      <img src={Book} alt="Open Book" />
                      <span>Hadith</span>
                    </div>
                    <img src={ArrowDown} alt="Arrow Down" />
                  </div>
                  <div className={openDropdownMenuTwo ? "block" : "hidden"}>
                    <ul>
                      {subMenuTwo.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-center px-4 py-4 cursor-pointer hover:bg-gray-100 border-t-2 border-gray-400"
                          onClick={() =>
                            setOpenMenu(
                              navigate(item.path),
                              !openMenu,
                              setOpenDropdownMenuTwo(!openDropdownMenuTwo)
                            )
                          }
                        >
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <ul>
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 px-4 py-4 cursor-pointer hover:bg-gray-100 border-b-2 border-gray-400"
                    onClick={() => {
                      navigate(item.path);
                      setOpenMenu(!openMenu);
                    }}
                  >
                    <img src={item.icon} alt={item.text} />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2 flex flex-col gap-2 bg-primary-foreground ">
                <h2 className="text-xl font-semibold text-center">
                  🕌 Become a Donor &{" "}
                </h2>
                <h2 className="text-xl font-semibold text-center">
                  Make an Impact
                </h2>
                <p className="text-justify text-sm">
                  Becoming a donor means more than just giving; it means
                  changing lives, supporting communities, and earning endless
                  rewards from Allah (SWT).
                </p>
                <button
                  onClick={() => {
                    navigate("/donate-checkout");
                    setOpenMenu(!openMenu);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Make A Donate
                </button>
              </div>
            </SheetContent>
          </Sheet>

          {/* header menu */}
          <div>
            <ul className="flex gap-4 md:gap-10">
              {headerMenu.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate(item.path)}
                >
                  <img src={item.icon} alt={item.text} />
                  <span className="hidden md:block">{item.text}</span>
                </li>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <img src={AccountIcon} alt="Account" />
                    <span className="hidden md:block">Account</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
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
                        <span>{user.name}</span>
                        {/* <p>{user.name}</p> */}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="bg-destructive text-white hover:text-gray-900 justify-center hover:bg-primary-foreground duration-500 cursor-pointer mt-4"
                        onClick={handleLogout}
                      >
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      className="bg-primary text-white hover:text-gray-900 justify-center hover:bg-primary-foreground duration-500 cursor-pointer mt-4"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </DropdownMenuItem>
                  )}
                  {isAuthenticated && roles.includes(user?.role) && (
                    <DropdownMenuItem
                      className="bg-primary text-white hover:text-gray-900 justify-center hover:bg-primary-foreground duration-500 cursor-pointer mt-4"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      Go to Dashboard
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
