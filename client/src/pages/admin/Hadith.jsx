// import { FaEdit } from "react-icons/fa";
// import { RiDeleteBinLine } from "react-icons/ri";

import { useGetAllBookListQuery } from "../../slices/utils";
import { useAddHadithMutation } from "../../slices/admin/hadith";

import CommonForm from "@/components/common/Form";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import HadithDisplay from "@/components/admin/HadithTile";
import { languagesList, booksList } from "../../constant";

const initialFormData = {
  bookName: "",
  partName: "",
  partNumber: "",
  chapterName: "",
  chapterNumber: "",
  hadithNumber: "",
  internationalNumber: "",
  hadithArabic: "",
  hadithBangla: "",
  hadithEnglish: "",
  hadithHindi: "",
  hadithIndonesia: "",
  hadithUrdu: "",
  referenceBook: "",
  similarities: "",
  translation: "",
  transliteration: "",
  narrator: "",
  note: "",
  keywords: [],
};

export default function Hadith() {
  const [openAddHadithForm, setOpenAddHadithForm] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [bookName, setBookName] = useState("Sahih Al-Bukhari");
  const [language, setLanguage] = useState("en");

  const [addHadith] = useAddHadithMutation();

  const { data: allBookList } = useGetAllBookListQuery();

  const resetForm = () => {
    setFormData(initialFormData);
    setOpenAddHadithForm(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const updatedFormData = {
      bookName: formData.bookName,
      partName: formData.partName,
      partNumber: formData.partNumber,
      chapterName: formData.chapterName,
      chapterNumber: formData.chapterNumber,
      hadithList: {
        hadithNumber: formData.hadithNumber,
        internationalNumber: formData.internationalNumber,
        hadithArabic: formData.hadithArabic,
        hadithBangla: formData.hadithBangla,
        hadithEnglish: formData.hadithEnglish,
        hadithHindi: formData.hadithHindi,
        hadithIndonesia: formData.hadithIndonesia,
        hadithUrdu: formData.hadithUrdu,
        referenceBook: formData.referenceBook,
        similarities: formData.similarities,
        translation: formData.translation,
        transliteration: formData.transliteration,
        narrator: formData.narrator,
        note: formData.note,
        keywords: formData.keywords,
      },
    };

    console.log(updatedFormData);

    try {
      const addResponse = await addHadith(updatedFormData).unwrap();
      // Show success or error messages based on the response
      if (addResponse.error) {
        toast.error(addResponse.error.message);
        console.log(addResponse.error);
      } else {
        toast.success(addResponse.message || "Hadith added successfully!");
        resetForm();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addHadithFormElements = [
    {
      label: "Book Name",
      name: "bookName",
      componentType: "select",
      options:
        allBookList &&
        allBookList.data?.map((language) => ({
          id: language?.nameEn,
          label: language?.nameEn,
        })),
      allClasses: {
        selectClass:
          "w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary",
      },
    },
    {
      label: "Part Name",
      name: "partName",
      componentType: "input",
      type: "text",
      placeholder: "Enter Part Name",
    },
    {
      label: "Part Number",
      name: "partNumber",
      componentType: "input",
      type: "number",
      placeholder: "Enter Part Number",
    },
    {
      label: "Chapter Name",
      name: "chapterName",
      componentType: "input",
      type: "text",
      placeholder: "Enter Chapter Name",
    },
    {
      label: "Chapter Number",
      name: "chapterNumber",
      componentType: "input",
      type: "text",
      placeholder: "Enter Chapter Number",
    },
    {
      label: "Hadith Number",
      name: "hadithNumber",
      componentType: "input",
      type: "text",
      placeholder: "Enter Hadith Number",
    },
    {
      label: "International Hadith Number",
      name: "internationalNumber",
      componentType: "input",
      type: "text",
      placeholder: "Enter International Hadith Number",
    },
    {
      label: "Hadith Arabic",
      name: "hadithArabic",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Hadith Arabic ( أدخل أبي العربي )",
    },
    {
      label: "Hadith Bangla",
      name: "hadithBangla",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Hadith Bangla ( বাংলা )",
    },
    {
      label: "Hadith English",
      name: "hadithEnglish",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Hadith English ( English )",
    },
    {
      label: "Hadith Hindi",
      name: "hadithHindi",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Hadith Hindi ( हिंदी )",
    },
    {
      label: "Hadith Indonesia",
      name: "hadithIndonesia",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Hadith Indonesia ( Bahasa Indonesia )",
    },
    {
      label: "Hadith Urdu",
      name: "hadithUrdu",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Hadith Urdu ( اردو )",
    },
    {
      label: "Reference Book",
      name: "referenceBook",
      componentType: "input",
      type: "text",
      placeholder: "Enter Reference Book",
    },
    {
      label: "Similarities",
      name: "similarities",
      componentType: "input",
      type: "text",
      placeholder: "Enter Similarities",
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
      label: "Narrator",
      name: "narrator",
      componentType: "input",
      type: "text",
      placeholder: "Enter Narrator",
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

  return (
    <>
      <div className="mt-12">
        <div className="flex justify-between container mx-auto px-4 sm:px-0">
          <div className="flex gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 rounded-md border bg-white focus:ring-2 focus:ring-primary"
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

            <select
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className="px-4 py-2 rounded-md border bg-white focus:ring-2 focus:ring-primary"
            >
              {booksList &&
                booksList.map((book, index) => (
                  <option
                    className="bg-primary/50 text-white"
                    key={index}
                    value={book?.nameEn}
                  >
                    {book?.nameEn}
                  </option>
                ))}
            </select>
          </div>
          <Button
            className="bg-primary text-white"
            onClick={() => {
              setOpenAddHadithForm(true);
              setCurrentEditedId(null);
              setFormData(initialFormData);
            }}
          >
            Add New Hadith
          </Button>
        </div>

        <HadithDisplay bookName={bookName} language={language} />
      </div>
      <Sheet
        open={openAddHadithForm}
        onOpenChange={(isOpen) => setOpenAddHadithForm(isOpen)}
      >
        <SheetContent side="right" className="overflow-auto w-[90%]">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Edit Hadith" : "Add Hadith"}
            </SheetTitle>
          </SheetHeader>
          <CommonForm
            layout={4}
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
            buttonText={currentEditedId ? "Save Changes" : "Add Hadith"}
            formControls={addHadithFormElements}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
