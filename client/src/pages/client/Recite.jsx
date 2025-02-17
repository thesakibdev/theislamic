import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllSurahsPaginatedQuery } from "@/slices/admin/surah";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useParams } from "react-router-dom";
import Loading from "@/components/common/Loading";
import { useGetAllLanguagesQuery } from "@/slices/utils";
import { useSelector } from "react-redux";
import OpenBook from "@/assets/icon/open_book.png";
import ReadBook from "@/assets/icon/book.png";
import VerseEndIcon from "@/assets/icon/VerseEndIcon";

export default function RecitePage() {
  const { number } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const isOpen = useSelector((state) => state.utility.isOpenSidebar);
  const [isMobile, setIsMobile] = useState(false);
  const [bismillahValid, setBismillahValid] = useState(true);

  // Detect if device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { data: languages } = useGetAllLanguagesQuery();
  const [openSheet, setOpenSheet] = useState(false);

  useEffect(() => {
    if (number === "9") {
      setBismillahValid(false);
    } else {
      setBismillahValid(true);
    }

    setCurrentPage(Number(number));
  }, [number]);

  const {
    data: surahData,
    isLoading,
    isError,
  } = useGetAllSurahsPaginatedQuery({
    page: currentPage,
    limit: 1,
  });

  const currentSurah = surahData?.surahs?.find(
    (surah) => surah.surahNumber === Number(number)
  );

  if (isLoading) return <Loading />;
  if (isError) return <p>এরর হয়েছে!</p>;

  function convertToArabicNumber(num) {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => arabicNumbers[digit])
      .join("");
  }
  return (
    <>
      <section
        className={`flex-1 p-4 pt-20 transition-all duration-300 ${
          isOpen ? "ml-0" : "-ml-64"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="p-5 flex justify-center w-full">
              <Tabs defaultValue="reading" className="m-0">
                <TabsList className="grid w-full grid-cols-2 justify-start">
                  <TabsTrigger
                    className="p-0 data-[state=active]:rounded-full py-1 data-[state=active]:bg-primary/70"
                    value="transliteration"
                  >
                    {isMobile ? (
                      <img src={OpenBook} alt="Transliteration" />
                    ) : (
                      "Transliteration"
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    className="p-0 data-[state=active]:rounded-full py-1 data-[state=active]:bg-primary/70"
                    value="reading"
                  >
                    {isMobile ? (
                      <img src={ReadBook} alt="Reading" />
                    ) : (
                      "Reading"
                    )}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="transliteration" className="w-full">
                  <div className="flex flex-col justify-center w-full">
                    <h2 className="text-2xl md:text-3xl text-center font-bold">
                      {bismillahValid
                        ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                        : ""}
                    </h2>
                    <div className="mt-4 flex flex-col">
                      {/* translation author */}
                      <div className="flex flex-col gap-1 my-2">
                        {/* <h4 className="font-bold text-sm text-black">
                          Translation by
                        </h4> */}
                        <p className="text-base text-black font-normal flex gap-3">
                          The Clear Quran Translation
                          <button
                            className="ml-2 text-primary font-bold"
                            onClick={() => setOpenSheet(true)}
                          >
                            (Change)
                          </button>
                        </p>
                      </div>

                      {isError ? (
                        <p>এরর হয়েছে!</p>
                      ) : isLoading ? (
                        <Loading />
                      ) : (
                        <div className="">
                          <div>
                            {currentSurah?.verses?.map((verse, index) => (
                              <div
                                key={index}
                                className="border-b border-primary"
                              >
                                <p className="text-right text-3xl md:text-4xl my-10 md:my-16 rtl:mr-3">{`${verse.arabicAyah} (${verse.verseNumber})`}</p>
                                {verse.verseOtherData
                                  ?.filter(
                                    (data) => data.language === selectedLanguage
                                  )
                                  .map((data) => (
                                    <p
                                      key={data._id}
                                      className="text-left mb-10 md:mb-16 text-lg md:text-2xl w-[90%]"
                                    >
                                      {data.transliteration}
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
                <TabsContent value="reading">
                  <div className="flex flex-col md:max-w-3xl mx-auto text-center justify-center w-full">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {bismillahValid
                        ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                        : ""}
                    </h2>

                    {isError ? (
                      <p>এরর হয়েছে!</p>
                    ) : isLoading ? (
                      <Loading />
                    ) : (
                      <div className="mt-4 text-center">
                        {/* {currentSurah?.verses
                          ?.slice(0, 7)
                          .map((verse, index) => (
                            <span
                              className="text-base md:text-4xl  rtl:mr-3 text-black  font-arabic font-medium text-center leading-relaxed break-all w-1/2 mx-auto py-2"
                              key={index}
                            >
                              {verse.arabicAyah
                                .split(" ")
                                .map((word, wordIndex) => (
                                  <span key={wordIndex} className="mx-4">
                                    {word}
                                  </span> // প্রতিটি শব্দের মধ্যে স্পেস থাকবে
                                ))}
                              <div className="relative w-[50px] rtl inline-flex items-center justify-center">
                                <VerseEndIcon width={40} height={40} />
                                <p className="absolute text-xs text-center">
                                  {convertToArabicNumber(verse.verseNumber)}
                                </p>
                              </div>
                            </span>
                          ))} */}
                        <div
                          dir="rtl"
                          className="text-black w-full mx-auto leading-relaxed text-justify"
                        >
                          {currentSurah?.verses?.map((verse, index) => (
                            <span
                              key={index}
                              className="text-base md:text-4xl font-arabic font-medium inline rtl:mr-0 align-middle"
                            >
                              {verse.arabicAyah}
                              <span className="relative w-[40px] h-[40px] inline-flex items-center justify-center align-middle ml-1">
                                <VerseEndIcon
                                  width={35}
                                  height={35}
                                  className="align-middle"
                                />
                                <span className="absolute text-xs text-center align-middle">
                                  {convertToArabicNumber(verse.verseNumber)}
                                </span>
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <Sheet
            open={openSheet}
            onOpenChange={(isOpen) => setOpenSheet(isOpen)}
          >
            <SheetContent className="bg-primary">
              <SheetHeader>
                <SheetTitle>Translation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col ">
                {languages?.data?.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      setOpenSheet(false);
                    }}
                    className={`px-4 py-2 m-2 ${
                      selectedLanguage === lang
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </section>
    </>
  );
}
