import { useGetAllSurahsNameQuery } from "@/slices/admin/surah";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CiSearch } from "react-icons/ci";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { LuNotebookTabs } from "react-icons/lu";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function ReciteSideBar() {
  const { data: allSurahs } = useGetAllSurahsNameQuery();
  console.log(allSurahs);
  const navigate = useNavigate();

  const handleGoToRecitePage = (id) => {
    navigate(`/recite/${id}`);
  };

  return (
    <aside className="w-0 md:w-2/6 max-h-screen h-full">
      {/* sidebar for desktop version */}
      <div className="hidden border-r-2 md:block p-5">
        <h3 className="text-2xl font-semibold underline cursor-pointer">
          {/* {surah.surahName} */}
          Al Fatiha
        </h3>

        <Tabs defaultValue="surah" className="my-5">
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
                  className="w-full border-2 border-none text-white placeholder:text-white bg-[#80BDA9] outline-none text-sm md:text-xl pl-2 rounded-md pr-8 py-1 md:py-3"
                  type="text"
                />
                <CiSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black  text-xl lg:text-3xl" />
              </div>
              <div className="mt-5 bg-[#80BDA9] max-h-[800px] overflow-auto rounded-md">
                <ul>
                  {allSurahs?.map((surah, index) => (
                    <li
                      key={index}
                      className="hover:bg-[#80BDA9] hover:text-white/90 border-b-2 text-white text-lg md:text-xl  text-center cursor-pointer p-3"
                      onClick={() => handleGoToRecitePage(surah.surahNumber)}
                    >
                      {surah.surahName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="juz">Juz</TabsContent>
        </Tabs>
      </div>

      {/* sidebar for mobile version */}
      <div className="md:hidden pt-7 flex items-center ">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <LuNotebookTabs />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <h3 className="text-2xl font-semibold underline cursor-pointer">
              {/* {surah.surahName} */}
              al Fatiha
            </h3>
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
                      {Array.from({ length: 24 }).map((_, index) => (
                        <li
                          key={index}
                          className="hover:bg-[#80BDA9] hover:text-white/90 border-b-2 text-white text-xl lg:text-3xl  text-center cursor-pointer p-3"
                        >
                          {index + 1}
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
    </aside>
  );
}
