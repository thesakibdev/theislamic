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
  useAddVerseMutation,
  useEditVerseMutation,
  useDeleteVerseMutation,
  useGetAllSurahsPaginatedQuery,
} from "@/slices/admin";
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

const initialFormData = {
  name: "",
  surahNumber: "",
  juzNumber: [],
  verseNumber: "",
  arabicText: "",
  keywords: [],
  translations: [],
  transliteration: [],
};

export default function Quran() {
  const [formData, setFormData] = useState(initialFormData);
  const [openAddVerseForm, setOpenAddVerseForm] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [openSurahs, setOpenSurahs] = useState({});

  const [addVerse] = useAddVerseMutation();
  const [editVerse] = useEditVerseMutation();
  const [deleteVerse] = useDeleteVerseMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: surahData,
    isLoading,
    isError,
  } = useGetAllSurahsPaginatedQuery({
    page: currentPage,
    limit: 5,
  });

  useEffect(() => {
    if (surahData) {
      console.log("সূরাগুলো:", surahData.surahs);
      console.log("সূরাগুলো:", surahData);
    }
  }, [surahData]);

  if (isLoading)
    return (
      <div className="loader max-w-2xl mx-auto">
        <p>Loading...</p>
      </div>
    );
  if (isError) return <p>এরর হয়েছে!</p>;

  const onSubmit = async (event) => {
    event.preventDefault();

    const updatedFormData = {
      name: formData.surahName,
      surahNumber: formData.surahNumber,
      juzNumber: formData.juzNumber,
      verse: {
        verseNumber: formData.verseNumber,
        arabicText: formData.arabicText,
        keywords: formData.keywords,
        translations: formData.translations || [],
        transliteration: formData.transliteration || [],
        globalVerseNumber: formData.globalVerseNumber,
      },
    };

    try {
      if (currentEditedId !== null) {
        const editResponse = await editVerse({
          surahNumber: formData.surahNumber,
          verseNumber: formData.verseNumber,
          ...updatedFormData,
        }).unwrap();
        // Show success message from server
        toast.success(editResponse.message || "Verse updated successfully!");
      } else {
        const addResponse = await addVerse(updatedFormData).unwrap();
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
    setOpenAddVerseForm(false);
    setCurrentEditedId(null);
  };

  const addVerseFormElements = [
    {
      label: "Juz Number",
      name: "juzNumber",
      componentType: "multiInput",
      type: "number",
      placeholder: "Enter Juz Number",
    },
    {
      label: "Surah Number",
      name: "surahNumber",
      componentType: "input",
      type: "text",
      placeholder: "Enter Surah Number",
    },
    {
      label: "Surah Name",
      name: "surahName",
      componentType: "input",
      type: "text",
      placeholder: "Enter Surah Name",
    },
    {
      label: "Verse Number",
      name: "verseNumber",
      componentType: "input",
      type: "text",
      placeholder: "Enter Verse Number",
    },
    {
      label: "Global Verse Number",
      name: "globalVerseNumber",
      componentType: "input",
      type: "number",
      placeholder: "Enter Global Verse Number",
    },
    {
      label: "Keywords",
      name: "keywords",
      componentType: "multiInput",
      type: "text",
      placeholder: "Enter Keywords",
    },
    {
      label: "Arabic Text",
      name: "arabicText",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Arabic Text",
    },
  ];

  const toggleSurah = (index) => {
    setOpenSurahs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDeleteVerse = async (surahNumber, verseNumber) => {
    try {
      const deleteResponse = await deleteVerse({
        surahNumber,
        verseNumber,
      }).unwrap();
      toast.success(deleteResponse.message || "Verse deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <>
      <div className="mt-12">
        <div className="flex justify-end">
          <Button
            className="bg-primary text-white mr-10"
            onClick={() => {
              setOpenAddVerseForm(true);
              setCurrentEditedId(null); // Ensure we're in "Add" mode
              setFormData(initialFormData);
            }}
          >
            Add New Verse
          </Button>
        </div>
        <div className="px-10">
          {/* heading */}
          <div className="flex items-center justify-between py-5">
            <div className="grid grid-cols-3 items-center w-full">
              <p className="font-semibold text-2xl w-36 font-sans">No.</p>
              <p className="font-semibold text-2xl font-sans col-span-2">
                Name
              </p>
            </div>
            <select
              className="bg-none text-sm text-black font-semibold rounded-md max-w-32 px-5 py-3 bg-white border outline-none border-black block w-full shadow-sm cursor-pointer transition ease-in-out duration-300"
              name="filter"
              id=""
            >
              <option value="all">Filter</option>
              <option value="quranAyatArabic">Quran Ayat Arabic</option>
              <option value="quranAyatEnglish">Quran Ayat English</option>
            </select>
          </div>

          <div className="pb-10">
            {surahData.surahs?.map((quran, index) => (
              <div
                key={index}
                className="py-2 cursor-pointer"
                onClick={() => toggleSurah(index)}
              >
                <div className="grid grid-cols-3 items-center gap-5">
                  <div className="font-semibold text-2xl w-36 font-sans">
                    {quran.surahNumber}
                  </div>
                  <div className="font-semibold text-2xl font-sans">
                    {quran.name}
                  </div>
                  <img
                    className={`transition-transform ${
                      openSurahs[index] ? "rotate-180" : ""
                    }`}
                    src={ArrowDown}
                    alt="Arrow Down"
                  />
                </div>

                <div className={openSurahs[index] ? "block my-5" : "hidden"}>
                  <ul>
                    {quran?.verses.map((verse, verseIndex) => (
                      <li
                        key={verseIndex}
                        className="px-4 py-4 hover:bg-gray-100 border-t-2 border-gray-400 last:border-b-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex gap-5 font-bold">
                            <span>{verse.verseNumber}. </span>
                            <span>{verse.arabicText}</span>
                          </div>

                          <div className="flex gap-4">
                            <button
                              className="px-6 py-2 flex items-center gap-2 text-white bg-primary rounded-md hover:bg-primary-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenAddVerseForm(true);
                                setCurrentEditedId(quran.surahNumber);
                                setFormData({
                                  surahName: quran.name,
                                  surahNumber: quran.surahNumber,
                                  juzNumber: quran.juzNumber || [],
                                  verseNumber: verse.verseNumber,
                                  globalVerseNumber: verse.globalVerseNumber,
                                  arabicText: verse.arabicText,
                                  keywords: verse.keywords || [],
                                  translations: verse.translations || [],
                                  transliteration: verse.transliteration || [],
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
                                  verse.verseNumber
                                );
                              }}
                            >
                              Delete <RiDeleteBinLine />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className=" container mx-auto p-4 flex justify-center">
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
        </div>
      </div>
      <Sheet
        open={openAddVerseForm}
        onOpenChange={(isOpen) => setOpenAddVerseForm(isOpen)}
      >
        <SheetContent side="right" className="overflow-auto w-[90%]">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Edit Verse" : "Add Verse"}
            </SheetTitle>
          </SheetHeader>
          <CommonForm
            layout={2}
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
    </>
  );
}
