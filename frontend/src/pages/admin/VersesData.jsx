import { FaEdit, FaTrash } from "react-icons/fa";
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

import { languagesList } from "../../constant";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loading from "@/components/common/Loading";
import VerseEndIcon from "@/assets/icon/VerseEndIcon";

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
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const [addVerseOtherData] = useAddVerseOtherDataMutation();
  const [editVerseOtherData] = useEditVerseOtherDataMutation();
  const [deleteVerseOtherData] = useDeleteVerseOtherDataMutation();

  const [surahNumber, setSurahNumber] = useState(1);
  const {
    data: surahData,
    isLoading,
    isError,
    refetch,
  } = useGetAllSurahsPaginatedQuery({
    language: selectedLanguage,
    surahNumber: surahNumber,
  });

  console.log(surahData);

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
        languagesList &&
        languagesList.map((language) => ({
          id: language?.code,
          label: language?.name,
        })),
      allClasses: {
        selectClass:
          "w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary",
      },
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

  const toggleSurah = (index) => {
    setOpenVerseDate((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDeleteVerse = async (surahNumber, verseNumber, language) => {
    try {
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this verse? This action cannot be undone."
      );

      if (userConfirmed) {
        const deleteResponse = await deleteVerseOtherData({
          surahNumber,
          verseNumber,
          language,
        }).unwrap();
        refetch();
        toast.success(
          deleteResponse.message || "Verse data deleted successfully"
        );
      } else {
        // User canceled the action
        toast.info("Delete action canceled");
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  function convertToArabicNumber(num) {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => arabicNumbers[digit])
      .join("");
  }

  return (
    <main className="mt-12">
      <h1 className="text-4xl font-semibold text-center">
        Verses Language Base Data
      </h1>
      <div className="mt-10 h-full">
        <div className="flex justify-between px-4 md:px-10">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 rounded-md border bg-adminInput focus:ring-2 focus:ring-primary"
          >
            {languagesList &&
              languagesList.map((language) => (
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
            <div className="px-4 md:px-10 mb-2">
              <div className="grid grid-cols-2 justify-between items-center">
                <div className="font-semibold text-2xl font-sans ">
                  Surah Name:{" "}
                  <span className="text-primary">{surahData?.surahName}</span>
                </div>
                <div className="font-semibold text-2xl font-sans text-right">
                  Surah No:{" "}
                  <span className="text-primary">{surahData?.surahNumber}</span>
                </div>
              </div>
              <div className="overflow-y-scroll h-[60vh]">
                {surahData?.verses?.map((verse, index) => (
                  <div
                    key={index}
                    className="border-t mt-2 border-primary md:gap-5 py-2 px-2 last:border-b cursor-pointer"
                    onClick={() => toggleSurah(index)}
                  >
                    <div className="data flex justify-between">
                      <span
                        key={index}
                        dir="rtl"
                        className="text-base md:text-2xl font-arabic font-medium inline rtl:mr-0 align-middle ayah"
                      >
                        {verse.arabicAyah}
                        <span className="relative w-[40px] h-[40px] inline-flex items-center justify-center align-middle ml-1">
                          <VerseEndIcon
                            width={30}
                            height={30}
                            className="align-middle"
                          />
                          <span className="absolute text-base text-center align-middle top-1">
                            {convertToArabicNumber(verse.verseNumber)}
                          </span>
                        </span>
                      </span>

                      <div className="flex gap-3 md:gap-5 ">
                        <div
                          className="text-primary cursor-pointer px-4 py-2 rounded-md hover:bg-primary/50 border border-primary flex items-center justify-center"
                          onClick={() => {
                            setFormData({
                              surahNumber: surahData.surahNumber,
                              verseNumber: verse.verseNumber,
                              translation: verse.verseOtherData?.translation,
                              transliteration:
                                verse.verseOtherData?.transliteration,
                              note: verse.verseOtherData?.note,
                              keywords: verse.verseOtherData?.keywords,
                            });
                            setOpenAddVerseDataForm(true);
                            setCurrentEditedId(verse._id);
                          }}
                        >
                          <FaEdit />
                        </div>
                        <div
                          className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer flex items-center justify-center"
                          onClick={() => {
                            handleDeleteVerse(
                              surahData.surahNumber,
                              verse.verseNumber,
                              verse.verseOtherData.language
                            );
                          }}
                        >
                          <FaTrash />
                        </div>
                      </div>
                    </div>

                    <div
                      className={
                        openVerseData[index] ? "block my-2 pl-4" : "hidden"
                      }
                    >
                      <p className="text-left text-sm sm:text-base md:text-lg">
                        <span className="font-semibold text-primary">
                          Translation :
                        </span>{" "}
                        {verse?.verseOtherData?.translation}
                      </p>
                      <p className="text-left text-sm sm:text-base md:text-lg">
                        <span className="font-semibold text-primary">
                          Transliteration :
                        </span>{" "}
                        {verse?.verseOtherData?.transliteration}
                      </p>
                      <p className="text-left text-sm sm:text-base md:text-lg">
                        <span className="font-semibold text-primary">
                          Note :
                        </span>{" "}
                        {verse?.verseOtherData?.note}
                      </p>
                      <p className="text-left text-sm sm:text-base md:text-lg">
                        <span className="font-semibold text-primary">
                          Keywords :
                        </span>{" "}
                        {verse?.verseOtherData?.keywords?.join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 flex justify-center">
              <Pagination className="px-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-label="Go to previous page"
                      onClick={() =>
                        setSurahNumber(() =>
                          surahNumber == 1 ? 1 : surahNumber - 1
                        )
                      }
                      className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                      disabled={surahNumber == 1}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                      onClick={() =>
                        setSurahNumber(() => surahNumber + 5, refetch())
                      }
                    >
                      Skip
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      aria-label="Go to next page"
                      onClick={() => setSurahNumber(surahNumber + 1)}
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
