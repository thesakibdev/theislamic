import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllSurahsPaginatedQuery } from "@/slices/admin/surah";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/common/Loading";
import { useSelector } from "react-redux";
import OpenBook from "@/assets/icon/open_book.png";
import ReadBook from "@/assets/icon/book.png";
import VerseEndIcon from "@/assets/icon/VerseEndIcon";
import { languagesList } from "@/constant";

export default function RecitePage() {
  const { number } = useParams();
  const isOpen = useSelector((state) => state.utility.isOpenSidebar);
  const [isMobile, setIsMobile] = useState(false);
  const [bismillahValid, setBismillahValid] = useState(true);
  const navigate = useNavigate();

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
  const [openSheet, setOpenSheet] = useState(false);

  const [surahNumber, setSurahNumber] = useState(1);

  useEffect(() => {
    if (number === "9") {
      setBismillahValid(false);
    } else {
      setBismillahValid(true);
    }

    setSurahNumber(Number(number));
  }, [number]);
  const {
    data: surahData,
    isLoading,
    isError,
  } = useGetAllSurahsPaginatedQuery({
    language: selectedLanguage,
    surahNumber: surahNumber,
  });

  console.log("surahData", surahData);

  const currentSurah = surahData?.surahNumber;
  console.log(surahData);

  const handleNextSurah = () => {
    if (currentSurah < 114) {
      navigate(`/recite/${currentSurah + 1}`);
    } else {
      console.log("last surah");
    }
  };

  const handlePreviousSurah = () => {
    if (currentSurah > 1) {
      navigate(`/recite/${currentSurah - 1}`);
    } else {
      console.log("first surah");
    }
  };

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
        className={`flex-1 p-4 pt-20 transition-all scrollbar-hidden duration-300 ${
          isOpen ? "ml-0" : "-ml-64"
        }`}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="p-2 flex justify-center w-full">
              <Tabs
                defaultValue="reading"
                className="m-0 pt-5 overflow-auto max-h-screen px-4 md:px-10 scrollbar-custom"
              >
                <TabsList className="grid mx-auto max-w-[600px] grid-cols-2 justify-start">
                  <TabsTrigger
                    className="p-0 md:w-[300px] data-[state=active]:rounded-full py-1 data-[state=active]:bg-primary/70"
                    value="transliteration"
                  >
                    {isMobile ? (
                      <img src={OpenBook} alt="Transliteration" />
                    ) : (
                      "Transliteration"
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    className="p-0 md:w-[300px] data-[state=active]:rounded-full py-1 data-[state=active]:bg-primary/70"
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
                      {isLoading ? (
                        <p>Loading......</p>
                      ) : (
                        <>
                          {bismillahValid
                            ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                            : ""}
                        </>
                      )}
                    </h2>
                    <div className="mt-4 flex flex-col">
                      {/* translation author */}
                      <div className="flex flex-col gap-1 my-2">
                        {/* <h4 className="font-bold text-sm text-black">
                          Translation by
                        </h4> */}
                        <p className="text-base text-black font-normal flex gap-3">
                          The Saheeh International
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
                        <div className="mt-2 md:mt-5 flex justify-center pt-2">
                          {" "}
                          <Loading />
                        </div>
                      ) : (
                        <div className="">
                          <div>
                            {surahData?.verses?.map((verse, index) => (
                              <div
                                key={index}
                                className="border-b border-primary flex flex-col gap-3 md:gap-5 py-3 md:py-10"
                              >
                                <span
                                  key={index}
                                  dir="rtl"
                                  className="text-2xl md:text-4xl font-arabic font-medium inline rtl:mr-0 align-middle ayah"
                                >
                                  {verse.arabicAyah}
                                  <span className="relative w-[40px] h-[40px] inline-flex items-center justify-center align-middle ml-1">
                                    <VerseEndIcon
                                      width={35}
                                      height={35}
                                      className="align-middle"
                                    />
                                    <span className="absolute text-xl text-center align-middle">
                                      {convertToArabicNumber(verse.verseNumber)}
                                    </span>
                                  </span>
                                </span>

                                <p className="text-left text-sm sm:text-base md:text-2xl w-[90%]">
                                  {verse?.verseNumber}{" "}
                                  {verse?.verseOtherData?.transliteration}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/*  next & prev button */}
                      <div className="flex gap-3 mt-5 justify-center">
                        <button
                          onClick={handlePreviousSurah}
                          className="bg-white hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-black px-6 py-2 rounded-lg border border-black hover:border-primary"
                        >
                          Prev
                        </button>
                        <button
                          onClick={handleNextSurah}
                          className="bg-white hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-black px-6 py-2 rounded-lg border border-black hover:border-primary"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reading" className="w-full">
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
                        <div
                          dir="rtl"
                          className="text-black w-full mx-auto leading-relaxed text-justify"
                        >
                          {surahData?.verses?.map((verse, index) => (
                            <span
                              key={index}
                              dir="rtl"
                              className="text-2xl md:text-4xl font-arabic font-medium inline rtl:mr-0 align-middle ayah"
                            >
                              {verse.arabicAyah}
                              <span className="relative w-[40px] h-[40px] inline-flex items-center justify-center align-middle ml-1">
                                <VerseEndIcon
                                  width={35}
                                  height={35}
                                  className="align-middle"
                                />
                                <span className="absolute text-xl text-center align-middle">
                                  {convertToArabicNumber(verse.verseNumber)}
                                </span>
                              </span>
                            </span>
                          ))}
                        </div>
                        {/*  next & prev button */}
                        <div className="flex gap-3 mt-5 justify-center">
                          <button
                            onClick={handlePreviousSurah}
                            className="bg-white hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-black px-6 py-2 rounded-lg border border-black hover:border-primary"
                          >
                            Prev
                          </button>
                          <button
                            onClick={handleNextSurah}
                            className="bg-white hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-black px-6 py-2 rounded-lg border border-black hover:border-primary"
                          >
                            Next
                          </button>
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
            <SheetContent className="bg-white">
              <SheetHeader>
                <SheetTitle>Translation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col overflow-auto h-screen">
                {languagesList.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
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
        </div>
      </section>
    </>
  );
}
