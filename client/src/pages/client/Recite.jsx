import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllSurahsNameQuery, useGetAllSurahsQuery } from "@/slices/admin/surah";
import { CiSearch } from "react-icons/ci";
import { useParams } from "react-router-dom";

export default function RecitePage() {
  const { number } = useParams();
  const { data: allSurah } = useGetAllSurahsQuery();
  const {data : allSurahName } = useGetAllSurahsNameQuery();
  const allSurahs = allSurahName.map((surah) => surah.surahName);
  console.log(allSurahs);
  const surah = allSurah.surahs.find(
    (surah) => surah.surahNumber === Number(number)
  );
  return (
    <>
      <section className="pt-10">
        <h2>Recite page</h2>
        <div className="container mx-auto px-4">
          <div className="flex ">
            <aside className=" w-1/4 min-h-screen h-full border-r-2">
              <div className="p-5">
                <h3 className="text-2xl font-semibold underline cursor-pointer">
                  {surah.surahName}
                </h3>

                <Tabs defaultValue="surah" className="my-5">
                  <TabsList className="grid grid-cols-2 rounded-full">
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
                    <div className="p-5">
                      <div className="relative">
                        <input
                          placeholder="Search Surah..."
                          className="w-full border-2 border-none text-white placeholder:text-white bg-[#80BDA9] outline-none rounded-md p-3"
                          type="text"
                        />
                        <CiSearch className="absolute right-3 top-3 text-white text-[27px]" />
                      </div>
                      <div className="mt-5 bg-[#80BDA9] max-h-[800px] overflow-auto rounded-md">
                        <ul>
                          {Array.from({ length: 114 }).map((_, index) => (
                            <li
                              key={index}
                              className="hover:bg-[#80BDA9] hover:text-white/90 border-b-2 text-white text-[27px]  text-center cursor-pointer p-3"
                            >
                              {allSurahs}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="juz">Juz</TabsContent>
                </Tabs>
              </div>
            </aside>
            <div className="p-10 mx-auto">
              <Tabs defaultValue="reading" className="w-[400px] my-5">
                <TabsList className="grid w-full grid-cols-2 justify-start">
                  <TabsTrigger
                    className="p-0 data-[state=active]:rounded-full"
                    value="transliteration"
                  >
                    Transliteration
                  </TabsTrigger>
                  <TabsTrigger
                    className="p-0 data-[state=active]:rounded-full"
                    value="reading"
                  >
                    Reading
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="transliteration">
                  <div className="flex justify-center w-full">
                    this is transliteration section
                  </div>
                </TabsContent>
                <TabsContent value="reading">
                  <div className="flex flex-col text-center justify-center w-full">
                    <h2 className="text-3xl font-bold">
                      بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ
                    </h2>
                    <div className="mt-4 flex flex-col">
                      {surah.verses.map((verse, index) => (
                        <p
                          key={index}
                          className="text-2xl mt-2 text-black text-center"
                        >
                          {verse.arabicAyah}
                        </p>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
