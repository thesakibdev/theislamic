import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import CommonForm from "@/components/common/Form";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import {
  useAddVerseOtherDataMutation,
  useEditVerseOtherDataMutation,
  useDeleteVerseOtherDataMutation,
  useGetAllSurahsPaginatedQuery,
} from "../../slices/admin/surah";

import { useGetAllLanguagesQuery } from "../../slices/utils";

import ArrowDown from "../../assets/icon/arrow-down.png";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loading from "@/components/common/Loading";

const initialFormData = {
  surahNumber: null,
  verseNumber: null,
  language: "",
  translation: "",
  transliteration: "",
  note: "",
  keywords: [],
};

export default function VersesOtherData() {
  const [formData, setFormData] = useState(initialFormData);
  const [openAddVerseDataForm, setOpenAddVerseDataForm] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [openVerseData, setOpenVerseDate] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState("eng");

  const { data: languages } = useGetAllLanguagesQuery();

  const [addVerseOtherData] = useAddVerseOtherDataMutation();
  const [editVerseOtherData] = useEditVerseOtherDataMutation();
  const [deleteVerseOtherData] = useDeleteVerseOtherDataMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: surahData,
    isLoading,
    isError,
    refetch,
  } = useGetAllSurahsPaginatedQuery({
    page: currentPage,
    limit: 1,
  });

  useEffect(() => {
    if (surahData) {
      return;
    }
  }, [surahData]);

  if (isLoading) return <Loading />;
  if (isError) return <p>এরর হয়েছে!</p>;

  const addVerseFormElements = [
    {
      label: "Surah Number",
      name: "surahNumber",
      componentType: "input",
      type: "text",
      placeholder: "Enter Surah Number",
    },
    {
      label: "Verse Number",
      name: "verseNumber",
      componentType: "input",
      type: "text",
      placeholder: "Enter Verse Number",
    },
    {
      label: "Languages",
      name: "language",
      componentType: "select",
      options:
        languages &&
        languages.data?.map((language) => ({
          id: language?.code,
          label: language?.name,
        })),
      allClasses: { selectClass: "w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary" },  
    },
    {
      label: "Translation",
      name: "translation",
      componentType: "input",
      type: "text",
      placeholder: "Enter Translation",
    },
    {
      label: "Transliteration",
      name: "transliteration",
      componentType: "input",
      type: "text",
      placeholder: "Enter Transliteration",
    },
    {
      label: "Note",
      name: "note",
      componentType: "input",
      type: "text",
      placeholder: "Enter Note",
    },
    {
      label: "Keywords",
      name: "keywords",
      componentType: "multiInput",
      type: "text",
      placeholder: "Enter Keywords",
    },
  ];

  const onSubmit = async (event) => {
    event.preventDefault();

    const updatedFormData = {
      surahNumber: formData.surahNumber,
      verseNumber: formData.verseNumber,
      language: formData.language,
      translation: formData.translation,
      transliteration: formData.transliteration,
      note: formData.note,
      keywords: formData.keywords,
    };

    try {
      if (currentEditedId !== null) {
        const editResponse = await editVerseOtherData({
          surahNumber: formData.surahNumber,
          verseNumber: formData.verseNumber,
          language: formData.language,
          ...updatedFormData,
        }).unwrap();
        // Show success message from server
        console.log(editResponse);
        toast.success(editResponse.message || "Verse updated successfully!");
      } else {
        const addResponse = await addVerseOtherData(updatedFormData).unwrap();
        // Show success or error messages based on the response
        if (addResponse.error) {
          toast.error(addResponse.error.message);
        } else {
          toast.success(addResponse.message || "Verse added successfully!");
        }
      }
    } catch (error) {
      // Extract and display server error message or default message
      const errorMessage = error.data?.message || "Error submitting data!";
      console.error("Error submitting data:", error);
      toast.error(errorMessage);
    }

    setFormData(initialFormData);
    setOpenAddVerseDataForm(false);
    setCurrentEditedId(null);
  };

  const toggleSurah = (surahIndex, verseIndex) => {
    setOpenVerseDate((prev) => ({
      ...prev,
      [`${surahIndex}-${verseIndex}`]: !prev[`${surahIndex}-${verseIndex}`],
    }));
  };

  const handleDeleteVerse = async (surahNumber, verseNumber, language) => {
    try {
      const deleteResponse = await deleteVerseOtherData({
        surahNumber,
        verseNumber,
        language,
      }).unwrap();
      refetch();
      toast.success(
        deleteResponse.message || "Verse data deleted successfully"
      );
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <main className="mt-12">
      <h1 className="text-4xl font-semibold text-center">
        Verses Language Base Data
      </h1>
      <div className="mt-10 h-full">
        <div className="flex justify-between px-10">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 rounded-md border bg-adminInput focus:ring-2 focus:ring-primary"
          >
            {languages.data &&
              languages.data?.map((language) => (
                <option
                  className="bg-primary/50 text-white"
                  key={language?.code}
                  value={language?.code}
                >
                  {language?.name}
                </option>
              ))}
          </select>

          <Button
            className="bg-primary text-white mr-10"
            onClick={() => {
              setOpenAddVerseDataForm(true);
              setCurrentEditedId(null);
              setFormData(initialFormData);
            }}
          >
            Add New Verse Data
          </Button>
        </div>

        {isError ? (
          <>Oh no, there was an error</>
        ) : isLoading ? (
          <>Loading...</>
        ) : surahData ? (
          <>
            {surahData?.surahs?.map((quran, index) => (
              <div key={index} className="py-2">
                <div className="flex justify-between items-center px-10 my-10">
                  <div className="font-semibold text-2xl w-36 font-sans">
                    Number: {quran.surahNumber}
                  </div>
                  <div className="font-semibold text-2xl font-sans">
                    Name: {quran.surahName}
                  </div>
                </div>

                <div className="h-[calc(100vh-320px)] overflow-y-auto">
                  <ul>
                    {quran?.verses.map((verse, verseIndex) => {
                      const selectedVerseData = verse.verseOtherData.find(
                        (data) => data.language === selectedLanguage
                      );

                      return (
                        <li
                          key={verseIndex}
                          className="py-4 hover:bg-gray-100 border-t-2 border-gray-400 last:border-b-2 cursor-pointer"
                          onClick={() => {
                            toggleSurah(index, verseIndex);
                          }}
                        >
                          <div className="flex px-5 justify-between items-center">
                            <div className="flex gap-5 font-bold">
                              <span className="text-lg">
                                {verse.verseNumber}. {verse.arabicAyah}
                              </span>
                            </div>
                            <img
                              className={`transition-transform ${
                                openVerseData[`${index}-${verseIndex}`]
                                  ? "rotate-180"
                                  : ""
                              }`}
                              src={ArrowDown}
                              alt="Arrow Down"
                            />
                          </div>
                          <div
                            className={
                              openVerseData[`${index}-${verseIndex}`]
                                ? "block my-5"
                                : "hidden"
                            }
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex gap-4 justify-end mb-5">
                              <button
                                className="px-6 py-2 flex items-center gap-2 text-white bg-primary rounded-md hover:bg-primary-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenAddVerseDataForm(true);
                                  setCurrentEditedId(quran.surahNumber);
                                  setFormData({
                                    surahNumber: quran.surahNumber,
                                    verseNumber: verse.verseNumber,
                                    language: selectedLanguage,
                                    ...selectedVerseData,
                                  });
                                }}
                              >
                                Edit <FaEdit />
                              </button>

                              <button
                                className="px-6 py-2 flex items-center gap-2 text-white bg-deleteRed rounded-md hover:bg-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteVerse(
                                    quran.surahNumber,
                                    verse.verseNumber,
                                    selectedLanguage
                                  );
                                }}
                              >
                                Delete <RiDeleteBinLine />
                              </button>
                            </div>
                            <div className="flex flex-col">
                              <p className="flex gap-2 text-md border-t p-5">
                                <span className="font-semibold">
                                  Translation:{" "}
                                </span>
                                {selectedVerseData?.translation}
                              </p>
                              <p className="flex gap-2 text-md border-t p-5">
                                <span className="font-semibold">
                                  Transliteration:{" "}
                                </span>
                                {selectedVerseData?.transliteration}
                              </p>
                              <p className="flex gap-2 text-md border-t p-5">
                                <span className="font-semibold">Note: </span>
                                {selectedVerseData?.note}
                              </p>
                              <p className="flex gap-2 text-md border-t p-5 pb-0">
                                <span className="font-semibold">
                                  Keywords:{" "}
                                </span>
                                {selectedVerseData?.keywords?.map((k, i) => (
                                  <span key={i} className="mr-2">
                                    {k}
                                  </span>
                                ))}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
            <div className="p-4 flex justify-center">
              <Pagination className="px-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-label="Go to previous page"
                      onClick={() =>
                        setCurrentPage(() =>
                          currentPage == 1 ? 1 : currentPage - 1
                        )
                      }
                      className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                      disabled={currentPage == 1}
                    />
                  </PaginationItem>
                  <PaginationItem className="flex">
                    <PaginationLink
                      className="hover:bg-green-400 cursor-pointer"
                      href="/quran?page=1"
                    >
                      1
                    </PaginationLink>
                    <PaginationLink
                      className="hover:bg-green-400 cursor-pointer"
                      href="/quran?page=2"
                    >
                      2
                    </PaginationLink>
                    <PaginationLink
                      className="hover:bg-green-400 cursor-pointer"
                      href="/quran?page=3"
                    >
                      3
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      aria-label="Go to next page"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : null}

        <Sheet
          open={openAddVerseDataForm}
          onOpenChange={(isOpen) => setOpenAddVerseDataForm(isOpen)}
        >
          <SheetContent side="right" className="overflow-auto w-[90%]">
            <SheetHeader>
              <SheetTitle>
                {currentEditedId ? "Edit Verse" : "Add Verse"}
              </SheetTitle>
            </SheetHeader>
            <CommonForm
              layout={3}
              allClasses={{
                formClass:
                  "grid grid-cols-2 gap-5 mt-10 py-10 px-16 bg-primary-foreground rounded-lg shadow-lg",
                inputClass:
                  "w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary",
                textareaClass:
                  "w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary",
              }}
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId ? "Save Changes" : "Add Verse"}
              formControls={addVerseFormElements}
            />
          </SheetContent>
        </Sheet>
      </div>
    </main>
  );
}
