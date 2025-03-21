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
  useEditArabicVerseMutation,
  useDeleteVerseMutation,
  useGetAllSurahsPaginatedQuery,
} from "../../slices/admin/surah";

const initialFormData = {
  surahName: "",
  surahNumber: "",
  juzNumber: [],
  verseNumber: "",
  arabicAyah: "",
  totalVerseNumber: "",
};

export default function Quran() {
  const [formData, setFormData] = useState(initialFormData);
  const [openAddVerseForm, setOpenAddVerseForm] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const [addVerse] = useAddVerseMutation();
  const [editVerse] = useEditArabicVerseMutation();
  const [deleteVerse] = useDeleteVerseMutation();

  const [surahNumber, setSurahNumber] = useState(1);
  const {
    data: surahData,
    isLoading,
    isError,
    refetch,
  } = useGetAllSurahsPaginatedQuery({
    language: "ar",
    surahNumber: surahNumber,
  });

  useEffect(() => {
    if (surahData) {
      return;
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

    const normalTotalVerseNumber = Number(formData.totalVerseNumber);

    const updatedFormData = {
      name: formData.surahName,
      surahNumber: formData.surahNumber,
      juzNumber: formData.juzNumber,
      verse: {
        verseNumber: formData.verseNumber,
        arabicAyah: formData.arabicAyah,
        totalVerseNumber: normalTotalVerseNumber,
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
      label: "Total Verse Number",
      name: "totalVerseNumber",
      componentType: "input",
      type: "text",
      placeholder: "Enter Total Verse Number",
    },
    {
      label: "Arabic Ayah",
      name: "arabicAyah",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Arabic Ayah ( أدخل أبي العربي )",
    },
  ];



  const handleNextSurah = () => {
    if (surahData?.surahNumber < 114) {
      setSurahNumber(surahData?.surahNumber + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log("next surah");
    } else {
      console.log("last surah");
    }
  };

  const handleSkipSurah = () => {
    if (surahData?.surahNumber <= 109) {
      // 114 থেকে 5 কম হলে তবেই 5 যোগ হবে
      setSurahNumber(surahData?.surahNumber + 5);
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log("skipped 5 surahs");
    } else {
      console.log("cannot skip, near last surah");
    }
  };

  const handlePreviousSurah = () => {
    if (surahData?.surahNumber > 1) {
      setSurahNumber(surahData?.surahNumber - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      console.log("first surah");
    }
  };

  const handleDeleteVerse = async (surahNumber, verseNumber) => {
    try {
      // Show a confirmation dialog
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this verse? This action cannot be undone."
      );

      // If the user clicks "OK", proceed with the delete API call
      if (userConfirmed) {
        const deleteResponse = await deleteVerse({
          surahNumber,
          verseNumber,
        }).unwrap();
        refetch();
        toast.success(deleteResponse.message || "Verse deleted successfully");
      } else {
        // User canceled the action
        toast.info("Delete action canceled");
      }
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
          <div className="mt-5">
            <div className="py-2 cursor-pointer">
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

              <div className="overflow-y-scroll max-h-[500px] mt-2 md:mt-5">
                <ul>
                  {surahData?.verses.map((verse, verseIndex) => (
                    <li
                      key={verseIndex}
                      className="px-4 py-4 hover:bg-gray-100 border-t-2 border-gray-400 last:border-b-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex gap-5 font-bold">
                          <span>{verse.verseNumber}. </span>
                          <span>{verse.arabicAyah}</span>
                        </div>

                        <div className="flex gap-4">
                          <button
                            className="px-6 py-2 flex items-center gap-2 text-white bg-primary rounded-md hover:bg-primary-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenAddVerseForm(true);
                              setCurrentEditedId(surahData.surahNumber);
                              setFormData({
                                surahName: surahData.surahName,
                                surahNumber: surahData.surahNumber,
                                juzNumber: surahData.juzNumber || [],
                                verseNumber: verse.verseNumber,
                                totalVerseNumber: verse.totalVerseNumber,
                                arabicAyah: verse.arabicAyah,
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
                                surahData.surahNumber,
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

            {surahData.surahs?.length === 0 && (
              <div className="flex justify-center items-center">
                <h1 className="text-2xl font-semibold">No data found</h1>
              </div>
            )}
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
              onClick={handleSkipSurah}
              className="bg-white hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-black px-6 py-2 rounded-lg border border-black hover:border-primary"
            >
              Skip
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
