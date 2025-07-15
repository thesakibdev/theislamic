import { Fragment, useState, useRef } from "react";
import { useGetBySurahQuery } from "../../../slices/admin/tafsir";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaAngleUp } from "react-icons/fa";
import { tafsirBooksList } from "../../../constant";
import { useParams } from "react-router-dom";

export default function TafsirPage() {
  const { surahNumber } = useParams();

  const [openNote, setOpenNote] = useState({});

  const [selectedTotalVerseNumber, setSelectedTotalVerseNumber] = useState(1);

  const defaultTafseerBook = tafsirBooksList[0];
  const [selectedBookName, setSelectedBookName] = useState(
    defaultTafseerBook?.nameBn
  );

  const [selectedLanguage, setSelectedLanguage] = useState("bn");

  const { data, isLoading, isError } = useGetBySurahQuery({
    language: selectedLanguage,
    surahNumber: surahNumber
  });
  const tafseerData = data?.tafsir
  console.log("tafseerData", tafseerData)

  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const ayahSectionRef = useRef(null);

  const toggleNote = (index) => {
    setOpenNote((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    setOpenNote((prev) => ({ ...prev }));
  }, []);

  useEffect(() => {
    if (ayahSectionRef.current) {
      ayahSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentAyahIndex]);

  const handleLanguageOnChange = (index) => {
    console.log("language on change", index);

    if (index === "en") {
      setSelectedBookName(defaultTafseerBook?.nameEn);
    } else {
      setSelectedBookName(defaultTafseerBook?.nameBn);
    }
  };

  useEffect(() => {
    console.log("BookName Changed!");
    if (selectedLanguage === "en") {
      setSelectedBookName(defaultTafseerBook.nameEn);
    } else {
      setSelectedBookName(defaultTafseerBook.nameBn);
    }

  }, [data, defaultTafseerBook, selectedBookName, selectedLanguage]);

  return (
    <section className="bg-[#CBCBCB] pt-[4.5rem] pb-5">
      <div className="container mx-auto px-4 md:px-0">
        {isLoading ? (
          <div className="loader max-w-2xl mx-auto">
            <p>Loading...</p>
          </div>
        ) : isError ? (
          <div className="text-center text-2xl font-semibold text-gray-500 py-4 h-screen flex items-center justify-center">
            কোন ডাটা পাওয়া যায়নি
          </div>
        ) : (
          <div className="">
            {tafseerData &&
              <main
                className="bg-white p-2 md:p-4 rounded-md min-h-screen overflow-y-auto"
              >
                {/* heading */}
                <div className="bg-primaryLight py-2 mb-3 rounded-md shadow-md">
                  <div className="max-w-2xl mx-auto">
                    {/* <h1>{"আল-কুরআন (তাফসীর)"}</h1> */}
                    <h1 className="text-2xl md:text-4xl font-semibold text-center">
                      {"Al-Quran (commentary)"}
                    </h1>
                  </div>
                </div>

                {/* tafsir */}
                <div className="my-2 md:my-4">
                  {/* filter items */}
                  <div className="flex justify-between text-black text-base md:text-lg capitalize p-2 bg-[#e3e7f3] rounded-md shadow-md mb-2 md:mb-4 md:p-4">
                    <div className="flex gap-3">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => {
                          setSelectedLanguage(e.target.value);
                          handleLanguageOnChange(e.target.value);
                        }}
                        className="px-4 py-2 rounded-md border bg-white focus:ring-2 focus:ring-primary"
                      >
                        <option className="bg-primary/50 text-white" value={"en"}>
                          {"English"}
                        </option>
                        <option className="bg-primary/50 text-white" value={"bn"}>
                          {"Bangla"}
                        </option>
                      </select>
                    </div>
                  </div>
                  {/* surah data */}
                  <div className="mb-2 md:mb-4 md:p-4">
                    <div ref={ayahSectionRef} id="ayah-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-black text-base md:text-lg capitalize p-2 bg-[#e8f0fd] rounded-md shadow-md">
                      <h4 className="bg-white rounded-md p-2">
                        <span className="font-bold pr-1">Surah Name:</span>{" "}
                        {tafseerData?.surahName}
                      </h4>
                      <h5 className="bg-white rounded-md p-2">
                        <span className="font-bold pr-1">Surah Number:</span>{" "}
                        {tafseerData?.surahNumber}
                      </h5>
                    </div>
                    <div className="flex flex-col items-center mt-4">
                      {tafseerData.tafseer && tafseerData.tafseer.length > 0 && (
                        <div className="bg-white rounded-md p-4 flex flex-col gap-4 w-full shadow-md">
                          {/* Nav bar for Ayah number and Arabic Ayah */}
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-6 border-b pb-2 mb-2">
                            <div className="text-lg font-semibold flex-shrink-0">
                              Ayah: {tafseerData.tafseer[currentAyahIndex]?.totalVerseNumber}
                            </div>
                            {tafseerData.tafseer[currentAyahIndex]?.arabicAyah && (
                              <div className="text-lg flex items-center gap-2">
                                <span className="font-bold">Arabic Ayah:</span>
                                <span dir="rtl" className="text-right rtl:mr-1 text-xl font-arabic">
                                  {tafseerData.tafseer[currentAyahIndex]?.arabicAyah}
                                </span>
                              </div>
                            )}
                          </div>
                          {/* Content */}
                          {tafseerData.tafseer[currentAyahIndex]?.content && (
                            <div className="text-base md:text-lg text-left">
                              <span className="font-bold pr-1">Content:</span>{" "}
                              <div 
                                dangerouslySetInnerHTML={{ 
                                  __html: tafseerData.tafseer[currentAyahIndex]?.content 
                                }}
                                className="mt-2"
                              />
                            </div>
                          )}
                          {/* note */}
                          {tafseerData.tafseer[currentAyahIndex]?._id && tafseerData.tafseer[currentAyahIndex].note && (
                            <div>
                              <Button
                                onClick={() => toggleNote(tafseerData.tafseer[currentAyahIndex]?._id)}
                                className="text-black font-medium text-base md:lg"
                              >
                                Note
                                <FaAngleUp
                                  className={`transition-transform ${openNote[tafseerData.tafseer[currentAyahIndex]?._id] ? "rotate-180" : ""} group-hover:text-primary duration-300`}
                                  alt="Arrow Down"
                                />
                              </Button>
                              <p
                                className={`${openNote[tafseerData.tafseer[currentAyahIndex]?._id] ? "block" : "hidden"} bg-[#dfdfff] p-2 md:p-4 mt-2 rounded-md`}
                              >
                                {tafseerData.tafseer[currentAyahIndex]?.note}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Navigation Buttons */}
                      <div className="flex gap-4 mt-4">
                        <Button
                          onClick={() => setCurrentAyahIndex((prev) => prev - 1)}
                          disabled={currentAyahIndex === 0}
                          className="px-4 py-2 bg-primary text-white"
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => setCurrentAyahIndex((prev) => prev + 1)}
                          disabled={tafseerData.tafseer && currentAyahIndex === tafseerData.tafseer.length - 1}
                          className="px-4 py-2 bg-primary text-white"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* main content */}
                  {/* {tafseer && tafseer?.OtherLanguageContent && (
                    <div className="p-2 bg-[#e9f0f6] border-b border-[#e9f0f6] mb-2 md:mb-4 md:p-4 rounded-md">
                      <p className="text-base sm:text-lg md:text-xl font-bangla">
                        {tafseer?.OtherLanguageContent}
                      </p>
                    </div>
                  )} */}
                </div>
              </main>
            }
          </div>
        )}
      </div>
    </section>
  );
}
