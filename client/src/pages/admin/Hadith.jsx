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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

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
};

export default function Hadith() {
  const [openAddHadithForm, setOpenAddHadithForm] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [currentPage, setCurrentPage] = useState(1);

  const [addHadith] = useAddHadithMutation();

  const { data: allBookList } = useGetAllBookListQuery();
  const {
    data: hadithData,
    isLoading,
    isError,
  } = useGetAllHadithByPaginationQuery({
    page: currentPage,
    limit: 1,
  });

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

        <div className="mt-10">
          {isError ? (
            <div>Error fetching data</div>
          ) : isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="">
              {hadithData?.hadiths?.map((hadith) => (
                <div className="border border-gray-300 p-4" key={hadith._id}>
                  <h1>Book Name: {hadith.bookName}</h1>
                  <div className="flex gap-2">
                    <p>Part Name: {hadith.partName}</p>
                    <p> Part Number: {hadith.partNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <p> Chapter Name: {hadith.chapterName}</p>
                    <p> Chapter Number: {hadith.chapterNumber}</p>
                  </div>
                  <h3>Hadith List</h3>
                  <ul className="">
                    {hadith.hadithList.map((hadithItem) => (
                      <li key={hadithItem._id} className="flex gap-2">
                        <p>Hadith Number: {hadithItem.hadithNumber}</p>
                        <p>Hadith Arabic: {hadithItem.hadithArabic}</p>
                        <p>
                          {" "}
                          International Hadith Number:{" "}
                          {hadithItem.internationalNumber}
                        </p>
                        <p>Similarities: {hadithItem.similarities}</p>{" "}
                        <p> Reference Book: {hadithItem.referenceBook}</p>{" "}
                        <p> Translation: {hadithItem.translation}</p>{" "}
                        <p> Transliteration: {hadithItem.transliteration}</p>{" "}
                        <p> Narrator: {hadithItem.narrator}</p>{" "}
                        <p>{hadithItem.note}</p> <p>Note: {hadithItem.note}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
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
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <Button
                  className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                  onClick={() => setCurrentPage(5)}
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
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
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
