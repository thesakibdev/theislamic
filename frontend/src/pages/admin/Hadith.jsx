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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const initialFormData = {
  bookName: "",
  partName: "",
  partNumber: "",
  chapterName: "",
  chapterNumber: "",
  hadithNumber: "",
  internationalNumber: "",
  hadithArabic: "",
  translation: "",
  transliteration: "",
  referenceBook: "",
  similarities: "",
  narrator: "",
  note: "",
  keywords: [],
};

export default function Hadith() {
  const [openAddHadithForm, setOpenAddHadithForm] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [bookName, setBookName] = useState("bukhari");
  const [language, setLanguage] = useState("bn");
  const [selectedHadith, setSelectedHadith] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [addHadith] = useAddHadithMutation();

  const resetForm = () => {
    setFormData(initialFormData);
    setOpenAddHadithForm(false);
  };

  const handleHadithClick = (hadith) => {
    setSelectedHadith(hadith);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedHadith(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const updatedFormData = {
      bookName: formData.bookName,
      language: formData.language,
      partName: formData.partName,
      partNumber: formData.partNumber,
      chapterName: formData.chapterName,
      chapterNumber: formData.chapterNumber,
      hadithList: {
        hadithNumber: formData.hadithNumber,
        internationalNumber: formData.internationalNumber,
        hadithArabic: formData.hadithArabic,
        translation: formData.translation,
        transliteration: formData.transliteration,
        referenceBook: formData.referenceBook,
        similarities: formData.similarities,
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
        booksList &&
        booksList.map((language) => ({
          id: language?.id,
          label: language?.nameEn,
        })),
      allClasses: {
        selectClass:
          "w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary",
      },
    },
    {
      label: "Language Name",
      name: "language",
      componentType: "select",
      options: [
        {
          id: "bn",
          label: "Bangla",
        },
        {
          id: "en",
          label: "English",
        },
        {
          id: "hi",
          label: "Hindi",
        },
        {
          id: "id",
          label: "Indonesia",
        },
        {
          id: "ur",
          label: "Urdu",
        },
      ],
      allClasses: {
        selectClass:
          "w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary cursor-pointer",
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
      label: "Translation",
      name: "translation",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Translation",
    },
    {
      label: "Transliteration",
      name: "transliteration",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Transliteration",
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
    <div className="container mx-auto px-4">
      <div className="bg-gray-300 p-4 rounded-lg">
        <h1 className="text-2xl md:text-3xl font-semibold text-center my-4 md:my-8">
          Hadith Management
        </h1>

        {/* Language and Book Selection */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 rounded-md border bg-white focus:ring-2 focus:ring-primary"
              >
                {languagesList &&
                  languagesList.map((lang) => (
                    <option
                      className="bg-primary/50 text-white"
                      key={lang?.code}
                      value={lang?.code}
                    >
                      {lang?.name}
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
                      value={book?.id}
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
        </div>

        {/* Hadith List Display */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <HadithDisplay 
            bookName={bookName} 
            language={language} 
            onHadithClick={handleHadithClick}
          />
        </div>

        {/* Hadith Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Hadith #{selectedHadith?.hadithNumber}
              </DialogTitle>
              <DialogDescription>
                Hadith Details and Information
              </DialogDescription>
            </DialogHeader>
            {selectedHadith && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      International Number
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedHadith.internationalNumber || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Reference Book
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedHadith.referenceBook || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Narrator
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedHadith.narrator || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Similarities
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedHadith.similarities || "N/A"}
                    </p>
                  </div>
                </div>
                
                {selectedHadith.hadithArabic && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Arabic Text
                    </label>
                    <div className="text-lg text-gray-900 bg-gray-50 p-4 rounded text-right rtl">
                      {selectedHadith.hadithArabic}
                    </div>
                  </div>
                )}

                {selectedHadith.translation && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Translation
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded">
                      {selectedHadith.translation}
                    </div>
                  </div>
                )}

                {selectedHadith.transliteration && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Transliteration
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded italic">
                      {selectedHadith.transliteration}
                    </div>
                  </div>
                )}

                {selectedHadith.note && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Note
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded">
                      {selectedHadith.note}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={closeDialog}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Sheet
        open={openAddHadithForm}
        onOpenChange={(isOpen) => setOpenAddHadithForm(isOpen)}
      >
        <SheetContent side="right" className="overflow-auto w-full md:w-[90%]">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Edit Hadith" : "Add Hadith"}
            </SheetTitle>
          </SheetHeader>
          <CommonForm
            layout={4}
            allClasses={{
              formClass:
                "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-6 md:mt-10 py-6 md:py-10 px-4 md:px-16 bg-primary-foreground rounded-lg shadow-lg",
              inputClass:
                "w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary",
              textareaClass:
                "w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary",
              btnClass: "text-white",
            }}
            onSubmit={onSubmit}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditedId ? "Save Changes" : "Add Hadith"}
            formControls={addHadithFormElements}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
