import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

import { useState } from "react";
import CommonForm from "@/components/common/Form";
// import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const initialFormData = {
  chapterNumber: "",
  surahNumber: "",
  surahName: "",
  verseNumber: "",
  arabicText: "",
  translations: [],
  transliteration: [],
  keywords: [],
};

export default function Quran() {
  const [formData, setFormData] = useState(initialFormData);
  const [openAddVerseForm, setOpenAddVerseForm] = useState(false);

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  const addVerseFormElements = [
    {
      label: "Juz Number",
      name: "chapterNumber",
      componentType: "input",
      type: "text",
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
      placeholder: "Enter Surah Number",
    },
    {
      label: "Keyword",
      name: "keywords",
      componentType: "multiInput",
      type: "text",
      placeholder: "Enter Keyword",
    },
    {
      label: "Arabic Text",
      name: "arabicText",
      componentType: "input",
      type: "text",
      placeholder: "Enter Arabic Text",
    },
    {
      name: "translations",
      label: "Translations",
      componentType: "multiObjectTextarea",
      fields: ["ban", "eng", "urdu"],
    },
    {
      name: "transliteration",
      label: "Transliteration",
      componentType: "multiObjectTextarea",
      fields: ["ban", "eng", "urdu"],
    },
  ];

  const allQuran = [
    {
      No: 1,
      Name: "Al-Fatihah",
      btn: "Edit",
      delete: "Delete",
    },
    {
      No: 2,
      Name: "Al-Baqarah",
      btn: "Edit",
      delete: "Delete",
    },
    {
      No: 3,
      Name: "Al-Imran",
      btn: "Edit",
      delete: "Delete",
    },
    {
      No: 4,
      Name: "An-Nisa",
      btn: "Edit",
      delete: "Delete",
    },
    {
      No: 5,
      Name: "Al-Maidah",
      btn: "Edit",
      delete: "Delete",
    },
    {
      No: 6,
      Name: "Al-Maidah",
      btn: "Edit",
      delete: "Delete",
    },
    {
      No: 7,
      Name: "Al-Maidah",
      btn: "Edit",
      delete: "Delete",
    },
    {
      No: 8,
      Name: "An-Nisa",
      btn: "Edit",
      delete: "Delete",
    },
    {
      No: 9,
      Name: "Al-Maidah",
      btn: "Edit",
      delete: "Delete",
    },
    {
      No: 10,
      Name: "Al-Maidah",
      btn: "Edit",
      delete: "Delete",
    },
  ];

  return (
    <>
      <div className="mt-12">
        <div className="flex justify-end">
          <Button
            className="bg-primary text-white mr-10"
            onClick={() => setOpenAddVerseForm(true)}
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
            {allQuran.map((quran, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center">
                  <div className="font-semibold text-2xl w-36 font-sans">
                    {quran.No}
                  </div>
                  <div className="font-semibold text-2xl font-sans">
                    {quran.Name}
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-12">
                  <button
                    className="px-6 py-2 flex items-center gap-2 text-xl font-semibold text-white bg-primary rounded-md hover:bg-primary-foreground hover:text-black transition duration-200"
                    onClick={() => {
                      setOpenAddVerseForm(true);
                      // setCurrentEditedId(product?._id);
                      // setFormData(product);
                    }}
                  >
                    {quran.btn}
                    <FaEdit className="text-xl font-semibold" />
                  </button>
                  <button className="px-6 py-2 font-semibold text-xl flex items-center gap-2 text-white bg-deleteRed rounded-md hover:bg-red-600 transition duration-200">
                    {quran.delete} <RiDeleteBinLine />
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
            <SheetTitle>{"Add Verse "}</SheetTitle>
          </SheetHeader>
          <CommonForm
            layout={2}
            allClasses={{
              formClass:
                "grid grid-cols-2 gap-5 mt-10 py-10 px-16 bg-primary-foreground rounded-lg shadow-lg",
              inputClass:
                "w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary",
            }}
            onSubmit={() => {
              // handleAddVerse();
              setOpenAddVerseForm(false);
            }}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Add Verse"}
            formControls={addVerseFormElements}
            isBtnDisabled={!isFormValid()}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
