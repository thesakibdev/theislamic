import {
  openSidebar,
  toggleSidebar,
} from "@/slices/utils/utilitySlice";
import { useDispatch } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CiSearch } from "react-icons/ci";
import { Sheet, SheetContent } from "../ui/sheet";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAllSurahsNameQuery,
  useGetAllSurahsPaginatedQuery,
} from "@/slices/admin/surah";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";

export default function ReciteHeader() {
  const { number } = useParams();
  const { data: allSurahs } = useGetAllSurahsNameQuery();
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: surahData, isLoading } = useGetAllSurahsPaginatedQuery({
    page: currentPage,
    limit: 1,
  });

  const currentSurah = surahData?.surahs?.find(
    (surah) => surah?.surahNumber === Number(number)
  );
  useEffect(() => {
    setCurrentPage(Number(number));
  }, [number]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        dispatch(openSidebar());
      } else {
        dispatch(openSidebar());
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  const handleClick = () => {
    dispatch(toggleSidebar());
    setSidebarOpen(!sidebarOpen);
  };

  // useEffect(() => {
  //   setInterval(() => {
  //     if (setSidebarOpen) {
  //       dispatch(closeSidebar());
  //       setSidebarOpen(false);
  //     }
  //   }, 10000);
  // }, []);

  const currentSurahName = allSurahs?.find(
    (surah) => surah.surahNumber === Number(number)
  ).surahName;
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const handleGoToRecitePage = (id) => {
    navigate(`/recite/${id}`);
    setOpenMobileSidebar(false);
  };
  return (
    <nav className={`bg-primary text-white fixed top-16 left-0 w-full z-20 `}>
      <div className="container mx-auto px-3 py-1 text-xl">
        <div className="flex">
          <button
            className="lg:hidden"
            onClick={() => {
              setOpenMobileSidebar(true);
            }}
          >
            {currentSurahName} <IoIosArrowDown className="inline" />
          </button>
          <button onClick={handleClick} className="hidden lg:block">
            {currentSurahName}{" "}
            {sidebarOpen ? (
              <IoIosArrowBack className="inline transition-all duration-300" />
            ) : (
              <IoIosArrowForward className="inline transition-all duration-300" />
            )}
          </button>

          {/* sidebar for mobile version */}
          <div className="lg:hidden pt-7 flex items-center ">
            <Sheet
              open={openMobileSidebar}
              onOpenChange={(isOpen) => setOpenMobileSidebar(isOpen)}
            >
              <SheetContent side="left" className="w-[80%]">
                <Tabs defaultValue="surah" className="my-5 w-full">
                  <TabsList className="flex gap-5 rounded-full">
                    <TabsTrigger
                      className="px-4 py-2 data-[state=active]:rounded-full"
                      value="surah"
                    >
                      Surah
                    </TabsTrigger>
                    <TabsTrigger
                      className="px-4 py-2 data-[state=active]:rounded-full"
                      value="juz"
                    >
                      Juz
                    </TabsTrigger>
                  </TabsList>
                  {/* <TabsContent value="surah">
                    <div className="md:p-2 lg:p-5">
                      <div className="relative">
                        <input
                          placeholder="Search Surah..."
                          className="w-full border-2 border-none text-white placeholder:text-white bg-[#80BDA9] outline-none rounded-md p-2 md:p-3"
                          type="text"
                        />
                        <CiSearch className="absolute right-3 top-3 text-white text-[27px]" />
                      </div>
                      <div className="mt-5 bg-[#80BDA9] max-h-[800px] overflow-auto rounded-md">
                        <ul>
                          {allSurahs?.map((surah, index) => (
                            <li
                              key={index}
                              className="hover:bg-[#80BDA9] hover:text-white/90 border-b-2 text-white text-lg md:text-xl  text-center cursor-pointer p-3"
                              onClick={() =>
                                handleGoToRecitePage(surah.surahNumber)
                              }
                            >
                              {surah.surahName}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent> */}
                  <TabsContent value="surah" className="m-0">
                    <div className="md:p-2 mt-5 lg:p-5 flex gap-2">
                      <div className="overflow-auto max-h-screen flex flex-col gap-2 w-4/5">
                        <div className="relative ">
                          <input
                            placeholder="Search Surah..."
                            className="w-full border-2 border-none text-black placeholder:text-black bg-gray-200 outline-none text-sm md:text-xl pl-2 rounded-md pr-8 py-1 md:py-3"
                            type="text"
                          />
                          <CiSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black  text-xl lg:text-3xl" />
                        </div>
                        <ul className="bg-gray-200 rounded-md ">
                          {allSurahs?.map((surah, index) => (
                            <li
                              key={index}
                              className="hover:bg-primary-foreground hover:text-black/90 border-b-2 text-black text-lg md:text-xl  text-center cursor-pointer p-3"
                              onClick={() =>
                                handleGoToRecitePage(surah.surahNumber)
                              }
                            >
                              {surah.surahName}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col gap-2 overflow-auto max-h-screen w-2/6">
                        <div className="relative ">
                          <input
                            placeholder="Verse"
                            className="w-full border-2 border-none text-black placeholder:text-black bg-gray-200 outline-none text-sm md:text-xl pl-2 rounded-md py-1 md:py-3"
                            type="text"
                          />
                          {/* <CiSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black  text-xl lg:text-3xl" /> */}
                        </div>
                        <ul className="bg-gray-200 rounded-md">
                          {currentSurah?.verses.map((verse, index) => (
                            <li
                              key={index}
                              className={`hover:bg-primary-foreground hover:text-black/90 border-b-2 text-black text-lg md:text-xl text-center cursor-pointer p-3 `}
                            >
                              {verse.verseNumber}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="juz" className="p-5 px-10">
                    Juz
                  </TabsContent>
                </Tabs>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
