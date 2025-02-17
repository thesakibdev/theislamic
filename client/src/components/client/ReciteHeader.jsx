import { openSidebar, toggleSidebar } from "@/slices/utils/utilitySlice";
import { useDispatch } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CiSearch } from "react-icons/ci";
import { Sheet, SheetContent } from "../ui/sheet";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllSurahsNameQuery } from "@/slices/admin/surah";
import { IoIosArrowDown } from "react-icons/io";

export default function ReciteHeader() {
  const { number } = useParams();
  const { data: allSurahs } = useGetAllSurahsNameQuery();
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const currentSurahName = allSurahs?.find(
    (surah) => surah.surahNumber === Number(number)
  ).surahName;

  const handleGoToRecitePage = (id) => {
    navigate(`/recite/${id}`);
    setOpenMobileSidebar(false);
  };

  return (
    <nav className={`bg-primary text-white fixed top-16 left-0 w-full z-20 `}>
      <div className="container mx-auto px-3 py-1 text-xl">
        <div className="flex">
          <button
            className="md:hidden"
            onClick={() => {
              // dispatch(toggleSidebar());
              setOpenMobileSidebar(true);
            }}
          >
            {currentSurahName} <IoIosArrowDown className="inline"/>
          </button>
          <button
            className="hidden md:block"
            onClick={() => {
              dispatch(toggleSidebar());
              // setOpenMobileSidebar(true);
            }}
          >
            {currentSurahName}
          </button>

          {/* sidebar for mobile version */}
          <div className="md:hidden pt-7 flex items-center ">
            <Sheet
              open={openMobileSidebar}
              onOpenChange={(isOpen) => setOpenMobileSidebar(isOpen)}
            >
              <SheetContent side="left" className="w-[80%]">
                <Tabs defaultValue="surah" className="my-5 w-full">
                  <TabsList className="grid grid-cols-1 md:grid-cols-2 rounded-full">
                    <TabsTrigger
                      className="p-0 data-[state=active]:rounded-full"
                      value="surah"
                    >
                      Surah
                    </TabsTrigger>
                    <TabsTrigger
                      className="p-0 data-[state=active]:rounded-full"
                      value="juz"
                    >
                      Juz
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="surah">
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
