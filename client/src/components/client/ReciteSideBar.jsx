import {
  useGetAllSurahsNameQuery,
  useGetAllSurahsPaginatedQuery,
} from "@/slices/admin/surah";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CiSearch } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function ReciteSideBar() {
  const { data: allSurahs } = useGetAllSurahsNameQuery();
  const { number } = useParams();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.utility.isOpenSidebar);
  // const dispatch = useDispatch();
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
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const handleGoToRecitePage = (id) => {
    navigate(`/recite/${id}`);
  };
  return (
    <aside
      className={`hidden md:block bg-gray-200 w-4/12 pt-24 transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* sidebar for desktop version */}
      <div className="hidden md:block border-r-2">
        <Tabs defaultValue="surah" className="m-0">
          <TabsList className="grid grid-cols-2 relative px-10 rounded-full m-0 mt-2">
            <TabsTrigger
              className="px-0 py-2 data-[state=active]:rounded-full"
              value="surah"
            >
              Surah
            </TabsTrigger>
            <TabsTrigger
              className="px-0 py-2 data-[state=active]:rounded-full"
              value="juz"
            >
              Juz
            </TabsTrigger>
            {/* <MdClose onClick={() => dispatch(toggleSidebar())} className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 transform text-black text-3xl"/> */}
          </TabsList>
          <TabsContent value="surah" className="m-0">
            <div className="md:p-2 lg:p-5 flex gap-2">
              <div className="overflow-auto max-h-[90vh] flex flex-col gap-2 w-4/5">
                <div className="relative ">
                  <input
                    placeholder="Search Surah..."
                    className="w-full border-2 border-none text-black placeholder:text-black bg-white outline-none text-sm md:text-xl pl-2 rounded-md pr-8 py-1 md:py-3"
                    type="text"
                  />
                  <CiSearch className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-black  text-xl lg:text-3xl" />
                </div>
                <ul className="bg-white rounded-md ">
                  {allSurahs?.map((surah, index) => (
                    <li
                      key={index}
                      className=" hover:text-black/90 hover:bg-primary-foreground border-b-2 text-black text-lg md:text-xl  text-center cursor-pointer p-3"
                      onClick={() => {
                        handleGoToRecitePage(surah.surahNumber);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {surah.surahName}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2 overflow-auto max-h-[90vh] w-2/6">
                <div className="relative ">
                  <input
                    placeholder="Verse"
                    className="w-full border-2 border-none text-black placeholder:text-black bg-white outline-none text-sm md:text-xl pl-2 py-2 rounded-md "
                    type="text"
                  />
                  {/* <CiSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black  text-xl lg:text-3xl" /> */}
                </div>
                <ul className="bg-white rounded-md">
                  {currentSurah?.verses.map((verse, index) => (
                    <li
                      key={index}
                      // className=" hover:text-black/90 hover:bg-primary-foreground border-b-2 text-black text-lg md:text-xl  text-center cursor-pointer p-3"
                      className={` hover:text-black/90 hover:bg-primary-foreground border-b-2 text-black text-lg md:text-xl text-center cursor-pointer p-3 `}
                      // onClick={() => handleGoToRecitePage(verse.verseNumber)}
                    >
                      {verse.verseNumber}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="juz">
            <div className="md:p-2 lg:p-5 min-h-screen">Juz</div>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
