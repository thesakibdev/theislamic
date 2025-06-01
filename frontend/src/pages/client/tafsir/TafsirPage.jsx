import { useState } from "react";
import { useGetAllTafsirByPaginationQuery } from "../../../slices/admin/tafsir";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaAngleUp } from "react-icons/fa";
import { tafsirBooksList } from "../../../constant";

export default function TafsirPage() {
  const [openNote, setOpenNote] = useState({});

  const [selectedTotalVerseNumber, setSelectedTotalVerseNumber] = useState(1);

  const defaultTafseerBook = tafsirBooksList[0];
  const [selectedBookName, setSelectedBookName] = useState(
    defaultTafseerBook?.nameBn
  );

  const [selectedLanguage, setSelectedLanguage] = useState("bn");

  const { data, isLoading, isError } = useGetAllTafsirByPaginationQuery({
    language: selectedLanguage,
    bookName: selectedBookName,
    totalVerseNumber: selectedTotalVerseNumber,
  });

  const [tafseer, setTafseer] = useState(null);

  console.log("fetched tafseer", tafseer?.tafsir);
  console.log("tafseer book list", tafsirBooksList);

  useEffect(() => {
    if (data) {
      console.log("Tafseer Data Changed", data);
      setTafseer(data); // Force update state when data changes
    }
  }, [data]);

  const toggleNote = (index) => {
    setOpenNote((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    setOpenNote((prev) => ({ ...prev }));
  }, []);

  const handleLanguageOnChange = (index) => {
    console.log("language on change", index);

    if (index === "en") {
      setSelectedBookName(defaultTafseerBook?.nameEn);
    } else {
      selectedBookName(defaultTafseerBook?.nameBn);
    }
  };

  useEffect(() => {
    console.log("BookName Changed!");
    if (selectedLanguage === "en") {
      setSelectedBookName(defaultTafseerBook.nameEn);
    } else {
      setSelectedBookName(defaultTafseerBook.nameBn);
    }

    setTafseer(data);
  }, [data, defaultTafseerBook, selectedBookName, selectedLanguage]);

  return (
    <section className="bg-[#CBCBCB] pt-[4.5rem] pb-5">
      <div className="container mx-auto px-4 md:px-0">
        {isLoading ? (
          <div className="loader max-w-2xl mx-auto">
            <p>Loading...</p>
          </div>
        ) : isError ? (
          <p className="text-center text-2xl font-semibold text-gray-500 py-4">
            কোন ডাটা পাওয়া যায়নি
          </p>
        ) : (
          tafseer.map((tafsir, index) => (
            <main
              key={index}
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

                    <select
                      value={selectedBookName}
                      onChange={(e) => setSelectedBookName(e.target.value)}
                      className="px-4 py-2 rounded-md border bg-white focus:ring-2 focus:ring-primary"
                    >
                      {tafsirBooksList &&
                        tafsirBooksList.map((book, index) => (
                          <option
                            className="bg-primary/50 text-white"
                            key={index}
                            value={
                              selectedLanguage === "en"
                                ? book?.nameEn
                                : book?.nameBn
                            }
                          >
                            {selectedLanguage === "en"
                              ? book.nameEn
                              : book.nameBn}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                {/* surah data */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-black text-base md:text-lg capitalize p-2 bg-[#e8f0fd] rounded-md shadow-md mb-2 md:mb-4 md:p-4">
                  {tafseer && tafseer?.surahName && (
                    <h4 className="bg-white rounded-md p-2">
                      <span className="font-bold pr-1">Surah Name:</span>{" "}
                      {tafseer?.surahName}
                    </h4>
                  )}
                  {tafseer && tafseer?.surahNumber && (
                    <h5 className="bg-white rounded-md p-2">
                      <span className="font-bold pr-1">Surah Number:</span>{" "}
                      {tafseer?.surahNumber}
                    </h5>
                  )}

                  {tafseer && tafseer?.verseNumber && (
                    <p className="bg-white rounded-md p-2">
                      <span className="font-bold pr-1">Ayah:</span>{" "}
                      {tafseer?.verseNumber}
                    </p>
                  )}
                  {tafseer && tafseer?.arabicAyah && (
                    <div className="grid grid-cols-2 items-center bg-white rounded-md p-2">
                      <p className="font-bold">Arabic Ayah:</p>
                      <span dir="rtl" className="text-right rtl:mr-1">
                        {tafseer?.arabicAyah}
                      </span>
                    </div>
                  )}

                  {tafseer && tafseer?.mainContent && (
                    <h6 className="bg-white rounded-md p-2 md:col-span-2">
                      <span className="font-bold pr-1">Content:</span>{" "}
                      {tafseer?.mainContent}
                    </h6>
                  )}
                </div>
                {/* main content */}
                {tafseer && tafseer?.OtherLanguageContent && (
                  <div className="p-2 bg-[#e9f0f6] border-b border-[#e9f0f6] mb-2 md:mb-4 md:p-4 rounded-md">
                    <p className="text-base sm:text-lg md:text-xl font-bangla">
                      {tafseer?.OtherLanguageContent}
                    </p>
                  </div>
                )}

                {/* note */}
                {tafseer && tafseer?.tafsirId && tafseer.note && (
                  <div>
                    <Button
                      onClick={() => toggleNote(tafseer?.tafsirId)}
                      className="text-black font-medium text-base md:lg"
                    >
                      Note
                      <FaAngleUp
                        className={`transition-transform ${
                          openNote[tafseer?.tafsirId] ? "rotate-180" : ""
                        } group-hover:text-primary duration-300`}
                        alt="Arrow Down"
                      />
                    </Button>
                    <p
                      className={`${
                        openNote[tafseer?.tafsirId] ? "block" : "hidden"
                      } bg-[#dfdfff] p-2 md:p-4 mt-2 rounded-md`}
                    >
                      {tafseer?.note}
                    </p>
                  </div>
                )}
              </div>
            </main>
          ))
        )}
      </div>
    </section>
  );
}
