import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { useState } from "react";
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
  useGetAllSurahsQuery,
} from "@/slices/admin";

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

  const [addVerse] = useAddVerseMutation();
  const [editVerse] = useEditVerseMutation();
  const { data } = useGetAllSurahsQuery();
  const surahs = data?.surahs;

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
      label: "Keywords",
      name: "keywords",
      componentType: "multiInput",
      type: "text",
      placeholder: "Enter Keywords",
    },
    {
      label: "Arabic Text",
      name: "arabicText",
      componentType: "input",
      type: "text",
      placeholder: "Enter Arabic Text",
    },
  ];

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
            <div className="flex items-center w-full">
              <p className="font-semibold text-2xl w-36 font-sans">No.</p>
              <p className="font-semibold text-2xl font-sans">Name</p>
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

          {/* content */}
          <div className="pb-10">
            {surahs?.map((quran, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                {/* Surah Details */}
                <div className="flex items-center">
                  <div className="font-semibold text-2xl w-36 font-sans">
                    {quran.surahNumber}
                  </div>
                  <div className="font-semibold text-2xl font-sans">
                    {quran.name}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-12">
                  {/* Edit Button */}
                  <button
                    className="px-6 py-2 flex items-center gap-2 text-xl font-semibold text-white bg-primary rounded-md hover:bg-primary-foreground hover:text-black transition duration-200"
                    onClick={() => {
                      setOpenAddVerseForm(true);
                      setCurrentEditedId(quran?.surahNumber); // Set current Surah Number for editing
                      setFormData({
                        surahName: quran.name,
                        surahNumber: quran.surahNumber,
                        juzNumber: quran.juzNumber,
                        verseNumber: quran.verses[0].verseNumber,
                        arabicText: quran.verses[0].arabicText,
                        keywords: quran.verses[0].keywords,
                        translations: quran.verses[0].translations,
                        transliteration: quran.verses[0].transliteration,
                      });
                    }}
                  >
                    Edit
                    <FaEdit className="text-xl font-semibold" />
                  </button>

                  {/* Delete Button */}
                  <button className="px-6 py-2 font-semibold text-xl flex items-center gap-2 text-white bg-deleteRed rounded-md hover:bg-red-600 transition duration-200">
                    Delete <RiDeleteBinLine />
                  </button>
                </div>
              </div>
            ))}
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
