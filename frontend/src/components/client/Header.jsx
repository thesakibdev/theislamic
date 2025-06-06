// Fixed Header Component with loading state handling
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
import ArrowDown from "../../assets/icon/arrow-down.png";

// components and use state
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { checkAuth, logoutUser } from "@/slices/authslice";
import { toast } from "react-toastify";

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
      icon: ManPraying,
      text: "5 Pillers",
      path: "/",
    },
    {
      icon: Donate,
      text: "Donors",
      path: "/donor",
    },
    {
      icon: Iwall,
      text: "Blogs",
      path: "/blogs",
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
      path: "/tafsir",
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
  const { user, isAuthenticated, isLoading, authChecked } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const roles = ["admin", "creator", "editor"];

  // Only calculate initialAvatar if user exists to prevent errors
  const initialAvatar = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "";

  // menu action related state
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdownMenu, setOpenDropdownMenu] = useState(false);
  const [openDropdownMenuTwo, setOpenDropdownMenuTwo] = useState(false);

  // all function
  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/login");
        toast.success("Logout successfully!");
      })
      .catch((error) => {
        toast.error("Logout failed: " + (error?.message || "Unknown error"));
      });
  };

  // Handle navigation while closing menus
  const handleNavigation = (path) => {
    navigate(path);
    setOpenMenu(false);
  };

  // Handle sub-menu navigation
  const handleSubMenuNavigation = (path, dropdownSetter) => {
    navigate(path);
    setOpenMenu(false);
    dropdownSetter(false);
  };

  // if (!authChecked && isLoading) {
  //   // Show a minimal loading state instead of rendering nothing
  //   return (

  //   );
  // }

  return (
    <>
      {!authChecked && isLoading && user === null ? (
        <header className="bg-white shadow-md fixed w-full left-0 top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-primary cursor-pointer">
                  Islamics.com
                </h1>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full animate-pulse bg-gray-300"></div>
              </div>
            </div>
          </div>
        </header>
      ) : (
        <header className="bg-white shadow-md fixed w-full left-0 top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <span
                  className="cursor-pointer"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <img src={MenuIcon} alt="The Islamics Center" />
                </span>
                <h1
                  onClick={() => navigate("/")}
                  className="text-xl font-bold text-primary cursor-pointer"
                >
                  Islamics.com
                </h1>
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
                              className="flex items-center px-4 py-4 cursor-pointer hover:bg-gray-100 border-t-2 border-gray-400 text-left"
                              onClick={() =>
                                handleSubMenuNavigation(
                                  item.path,
                                  setOpenDropdownMenu
                                )
                              }
                            >
                              <span className="pl-[85px]">{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* sub menu two */}
                    <div className="hover:bg-gray-100 border-b-2 border-t-2 border-gray-400">
                      <div
                        className="flex items-center justify-between px-4 py-4 cursor-pointer"
                        onClick={() =>
                          setOpenDropdownMenuTwo(!openDropdownMenuTwo)
                        }
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
                              className="flex items-center px-4 py-4 cursor-pointer hover:bg-gray-100 border-t-2 border-gray-400"
                              onClick={() =>
                                handleSubMenuNavigation(
                                  item.path,
                                  setOpenDropdownMenuTwo
                                )
                              }
                            >
                              <span className="pl-[85px]">{item.text}</span>
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
                        onClick={() => handleNavigation(item.path)}
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
                      changing lives, supporting communities, and earning
                      endless rewards from Allah (SWT).
                    </p>
                    <button
                      onClick={() => handleNavigation("/donate-checkout")}
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
                      {isAuthenticated && user ? (
                        <>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => navigate("/profile")}
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
                            <span>{user.name}</span>
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
                      {isAuthenticated &&
                        user &&
                        roles.includes(user?.role) && (
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
      )}
    </>
  );
}
