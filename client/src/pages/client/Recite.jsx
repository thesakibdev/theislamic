import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetAllSurahsNameQuery,
  useGetAllSurahsQuery,
} from "@/slices/admin/surah";
import { CiSearch } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { LuNotebookTabs } from "react-icons/lu";

export default function RecitePage() {
  const { number } = useParams();
  // // surah list
  const { data: allSurahName } = useGetAllSurahsNameQuery();
  const allSurahs = allSurahName.map((surah) => surah.surahName);
  console.log(allSurahs);

  //  data
  const { data: allSurah } = useGetAllSurahsQuery();
  const transliteration = allSurah?.surahs?.find(
    (surah) => surah.surahNumber === Number(number)
  );
  const allAyah = transliteration?.verses?.map((verse) => ({
    verseNumber: verse.verseOtherData,
    arabicAyah: verse.arabicAyah,
  }));
  // console.log(allAyah?.map((ayah) => ayah.arabicAyah));
  const currentSurah = allAyah?.map((ayah) => ayah.arabicAyah);
  const translateAyah = allAyah?.map((ayah) => ayah.verseNumber);
  const tranlateEn = translateAyah?.map(
    (ayah) => ayah.find((ayah) => ayah.language === "en").translation
  );
  const tranlateEng = allAyah?.map((ayah) => {
    return (
      ayah.translations?.find((t) => t.language === "en")?.translation ||
      "Translation not available"
    );
  });
  console.log(tranlateEng);
  console.log(currentSurah);
  console.log(tranlateEn);
  // console.log(translateAyah?.map((ayah) => ayah.find((ayah) => ayah.language === 'en').translation));
  // console.log(transliteration.verses[0].arabicAyah);
  // console.log(transliteration.verses[0].verseOtherData[1].translation);

  return (
    <>
      <section className="pt-10">
        <h2>Recite page</h2>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            <aside className="w-0 md:w-2/6 max-h-screen h-full">
              {/* sidebar for desktop version */}
              <div className="hidden border-r-2 md:block p-5">
                <h3 className="text-2xl font-semibold underline cursor-pointer">
                  {/* {surah.surahName} */}
                  al Fatiha
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
                          {/* {Array.from({ length: 24 }).map((_, index) => (
                            <li
                            key={index}
                            className="hover:bg-[#80BDA9] hover:text-white/90 border-b-2 text-white text-[27px]  text-center cursor-pointer p-3"
                            >
                            {index + 1}
                            </li>
                            ))} */}
                          {allSurahs?.map((surah, index) => (
                            <li
                              key={index}
                              className="hover:bg-[#80BDA9] hover:text-white/90 border-b-2 text-white text-lg md:text-xl  text-center cursor-pointer p-3"
                            >
                              {surah}
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
            <div className="p-5 flex justify-center w-full">
              <Tabs defaultValue="reading" className="my-5">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 justify-start">
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
                  <div className="flex flex-col justify-center max-w-3xl min-w-full md:min-w-2xl">
                    <h2 className="text-2xl md:text-3xl text-center font-bold">
                      بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ
                    </h2>
                    <div className="mt-4 flex items-center flex-col">
                      {/* translation author */}
                      <div className="flex flex-col gap-1 my-2 items-start">
                        <h4 className="font-bold text-sm text-black">
                          Translation by
                        </h4>
                        <p className="text-base text-black font-normal">
                          Dr. Mustafa Khattab, The Clear Quran Translation
                        </p>
                      </div>
                      {/* {Array.from({ length: 10 }).map((_, index) => ( */}
                      <div
                        // key={index}
                        className={`flex flex-col items-center gap-1 my-2`}
                      >
                        {/* <p className="w-5/6 text-2xl text-right mt-2 text-black">
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ١
                            ٱلْحَمْدُٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ١
                            ٱلْحَمْدُ
                          </p>
                            <p className="w-5/6 text-2xl text-left mt-2 text-black">
                              {" "}
                              this is english translation{" "}
                            </p> */}
                        {currentSurah?.map((ayah, index) => (
                          <p
                            key={index}
                            className="w-5/6 text-2xl text-right mt-2 text-black"
                          >
                            {ayah}
                          </p>
                        ))}
                        {tranlateEn?.map((en, index) => (
                          <p
                            key={index}
                            className="w-5/6 text-2xl text-left mt-2 text-black"
                          >
                            {en}
                            this is english translation{" "}
                          </p>
                        ))}
                      </div>
                      {/* ))} */}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reading">
                  <div className="flex flex-col text-center justify-center max-w-3xl w-full">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ
                    </h2>
                    <div className="mt-4 flex flex-col">
                      {currentSurah?.map((ayah, index) => (
                        <p
                          key={index}
                          className="text-2xl mt-2 text-black text-center"
                        >
                          {ayah}
                        </p>
                      ))}
                      {/* {Array.from({ length: 10 }).map((_, index) => (
                        <p
                          key={index}
                          className="text-2xl mt-2 text-black text-center"
                        >
                          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ١ ٱلْحَمْدُ
                          لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ٢
                        </p>
                      ))} */}
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
