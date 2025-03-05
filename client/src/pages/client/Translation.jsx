import Loading from "@/components/common/Loading";
import { Button } from "@/components/ui/button";
import WorldIcon from "@/assets/icon/world-icon.png";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetAllSurahsNameQuery,
  useGetAllSurahsPaginatedQuery,
} from "@/slices/admin/surah";
import { useGetAllLanguagesQuery } from "@/slices/utils";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Translation() {
  const [openSheet, setOpenSheet] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedLanguageName, setSelectedLanguageName] = useState("English");
  const { data: allSurahs } = useGetAllSurahsNameQuery();
  const { data: languages } = useGetAllLanguagesQuery();
  const { data: surahData, isLoading } = useGetAllSurahsPaginatedQuery({
    page: currentPage,
    limit: 1,
  });

  const currentSurah =
    surahData?.surahs?.find((surah) => surah.surahNumber === currentPage) ||
    null;

  useEffect(() => {
    if (currentSurah) {
      setCurrentPage(Number(currentSurah?.surahNumber));
    }
  }, [currentSurah]);

  console.log(languages);

  return (
    <>
      <section className="pt-16">
        <div className="container mx-auto">
          <div>
            <h2 className="text-4xl font-medium py-2 text-center">
              {currentSurah?.surahName || "Surah Name"}
            </h2>
            {/* select the surah */}
            <div className="flex flex-col items-center gap-3 mt-4 justify-center">
              <span className="text-sm text-primary font-medium">
                The description of the surah
              </span>
              <Select
                onValueChange={(value) => setCurrentPage(parseInt(value, 10))}
              >
                <SelectTrigger className="max-w-[280px] focus:outline-none active:outline-none">
                  <SelectValue
                    placeholder={
                      currentPage
                        ? `${currentSurah?.surahNumber} ${currentSurah?.surahName}`
                        : `Select a surah`
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {isLoading ? (
                      <Loading />
                    ) : (
                      allSurahs && (
                        <>
                          {allSurahs?.map((surah) => (
                            <SelectItem
                              key={surah.surahNumber}
                              value={surah.surahNumber.toString()}
                            >
                              {surah.surahNumber} - {surah.surahName}
                            </SelectItem>
                          ))}
                        </>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>{" "}
          {/* main */}
          <div className="mt-10 ">
            <Tabs defaultValue="arabic">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 gap-1 h-full">
                <TabsTrigger
                  value="arabic"
                  className="data-[state=active]:border rounded-t-lg data-[state=active]:border-b-0 py-2 border-primary bg-none data-[state=active]:rounded-b-none data-[state=active]:rounded-t-lg data-[state=active]:bg-transparent data-[state=active]:text-black"
                >
                  Arabic / {selectedLanguage}
                </TabsTrigger>
                <TabsTrigger
                  value="translation"
                  className="h-full data-[state=active]:border rounded-t-lg data-[state=active]:border-b-0 py-2 border-primary bg-none data-[state=active]:rounded-b-none data-[state=active]:rounded-t-lg data-[state=active]:bg-transparent data-[state=active]:text-black"
                >
                  {selectedLanguageName}
                </TabsTrigger>
                <div className="w-full col-span-2 flex justify-end">
                  <Button
                    onClick={() => setOpenSheet(true)}
                    className="group relative flex items-center gap-2 bg-opacity-50 px-2 text-white 
             w-10 hover:w-40 transition-all duration-500 ease-in-out justify-start overflow-hidden"
                  >
                    <img
                      src={WorldIcon}
                      alt=""
                      className="w-6 h-6 transition-all duration-500 ease-in-out"
                    />
                    <span
                      className="opacity-0 scale-95 translate-x-[-5px] 
                   group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 
                   transition-all duration-500 whitespace-nowrap"
                    >
                      Change Language
                    </span>
                  </Button>
                </div>
              </TabsList>
              <TabsContent
                className="mt-0 py-5 border border-primary data-[state=active]:rounded-b-lg data-[state=active]:rounded-r-lg"
                value="arabic"
              >
                {isLoading ? (
                  <Loading />
                ) : (
                  <div className="">
                    <div>
                      {currentSurah?.verses?.map((verse, index) => (
                        <div
                          key={index}
                          className="border-b border-primary flex flex-col gap-3 md:gap-5 py-3 px-2 md:px-5 md:py-10"
                        >
                          <div className="text-right text-xl md:text-4xl rtl:mr-3">
                            <span className="">{verse.arabicAyah}</span>
                          </div>

                          {verse.verseOtherData
                            ?.filter(
                              (data) => data.language === selectedLanguage
                            )
                            .map((data) => (
                              <p
                                key={data._id}
                                className="text-left text-sm sm:text-base md:text-2xl w-[90%]"
                              >
                                {data.translation}
                              </p>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent
                className="mt-0 py-2 border border-primary data-[state=active]:rounded-lg"
                value="translation"
              >
                <div className="mt-4 text-center">
                  <div className="text-black w-full mx-auto leading-relaxed text-justify">
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <div className="">
                        <div>
                          {currentSurah?.verses?.map((verse, index) => (
                            <div
                              key={index}
                              className="border-b border-primary flex flex-col gap-3 md:gap-5 px-5 py-3 md:py-5"
                            >
                              {verse.verseOtherData
                                ?.filter(
                                  (data) => data.language === selectedLanguage
                                )
                                .map((data) => (
                                  <p
                                    key={data._id}
                                    className="text-left text-sm sm:text-base md:text-2xl w-[90%]"
                                  >
                                    <span className="font-semibold mr-2">
                                      {verse.verseNumber}.
                                    </span>
                                    {data.translation}
                                  </p>
                                ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Sheet open={openSheet} onOpenChange={(isOpen) => setOpenSheet(isOpen)}>
        <SheetContent className="bg-white">
          <SheetHeader>
            <SheetTitle>Translation</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col overflow-auto h-screen">
            {languages?.data?.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLanguage(lang.code);
                  setSelectedLanguageName(lang.name);
                  setOpenSheet(false);
                }}
                className={`px-4 py-2 m-2 ${
                  selectedLanguage === lang
                    ? "bg-green-500 text-black"
                    : "bg-gray-200"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
