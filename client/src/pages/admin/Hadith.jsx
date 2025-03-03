// import { FaEdit } from "react-icons/fa";
// import { RiDeleteBinLine } from "react-icons/ri";

import { useGetAllBookListQuery } from "../../slices/utils";
import {
  useAddHadithMutation,
  useGetAllHadithByPaginationQuery,
} from "../../slices/admin/hadith";

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

const initialFormData = {
  bookName: "",
  partName: "",
  partNumber: "",
  chapterName: "",
  chapterNumber: "",
  hadithNumber: "",
  internationalNumber: "",
  hadithArabic: "",
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
  const [currentPage, setCurrentPage] = useState(1);
  const [hadithPage, setHadithPage] = useState(1);

  const [addHadith] = useAddHadithMutation();

  const { data: allBookList } = useGetAllBookListQuery();
  const {
    data: response,
    isLoading,
    isError,
  } = useGetAllHadithByPaginationQuery({
    page: currentPage,
    limit: 1,
    hadithPage: hadithPage,
    hadithLimit: 5,
  });

  // Extract data from the response
  const hadithData = response?.data || [];

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
        referenceBook: formData.referenceBook,
        similarities: formData.similarities,
        translation: formData.translation,
        transliteration: formData.transliteration,
        narrator: formData.narrator,
        note: formData.note,
        keywords: formData.keywords,
      },
    };

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
        <div className="flex justify-end">
          <Button
            className="bg-primary text-white mr-10"
            onClick={() => {
              setOpenAddHadithForm(true);
              setCurrentEditedId(null); // Ensure we're in "Add" mode
              setFormData(initialFormData);
            }}
          >
            Add New Hadith
          </Button>
        </div>

        {/* <div className="mt-10">
          {isError ? (
            <div>Error fetching data</div>
          ) : isLoading ? (
            <div>Loading...</div>
          ) : hadithData.length === 0 ? (
            <div>No hadiths found</div>
          ) : (
            <div className="border border-gray-300 p-4">
              {hadithData.map((hadith, index) => (
                <div className="border border-gray-300 p-4" key={index}>
                  <h2>Book Name: {hadith?.bookName}</h2>
                  <div>
                    {hadith?.parts?.map((hadithItem, index) => (
                      <div key={index}>
                        <p>Part Name: {hadithItem?.partName}</p>
                        <p>Part Number: {hadithItem?.partNumber}</p>

                        <div>
                          {hadithItem?.chapters?.map((chapter, index) => (
                            <div key={index}>
                              <p>Chapter Name: {chapter?.chapterName}</p>
                              <p>Chapter Number: {chapter?.chapterNumber}</p>

                              <div>
                                {chapter?.hadithList?.map((hadith, index) => (
                                  <div
                                    className="border border-gray-300 p-4 my-3 grid grid-cols-3 gap-5"
                                    key={index}
                                  >
                                    <p>Hadith Number: {hadith?.hadithNumber}</p>
                                    <p>
                                      International Hadith Number:{" "}
                                      {hadith?.internationalNumber}
                                    </p>
                                    <p>Hadith Arabic: {hadith?.hadithArabic}</p>
                                    <p>
                                      Reference Book: {hadith?.referenceBook}
                                    </p>
                                    <p>Similarities: {hadith?.similarities}</p>
                                    <p>Translation: {hadith?.translation}</p>
                                    <p>
                                      Transliteration: {hadith?.transliteration}
                                    </p>
                                    <p>Narrator: {hadith?.narrator}</p>
                                    <p>Note: {hadith?.note}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}

        <HadithDisplay />
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
