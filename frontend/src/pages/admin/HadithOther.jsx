import { Button } from "@/components/ui/button";
import { useState } from "react";
import CommonForm from "@/components/common/Form";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useGetAllBookListQuery,
  useGetAllLanguagesQuery,
} from "../../slices/utils";
import {
  useAddHadithOtherLanguageMutation,
  useGetAllHadithByPaginationQuery,
} from "../../slices/admin/hadith";

const initialFormData = {
  language: "",
  bookName: "",
  partNumber: "",
  chapterNumber: "",
  hadithNumber: "",
  hadithText: "",
  translation: "",
  transliteration: "",
  note: "",
};

export default function HadithOther() {
  const [openAddHadithForm, setOpenAddHadithForm] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [currentPage, setCurrentPage] = useState(1);
  const [hadithPage, setHadithPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const [addHadith] = useAddHadithOtherLanguageMutation();

  const { data: allBookList } = useGetAllBookListQuery();
  const { data: allLanguages } = useGetAllLanguagesQuery();
  const { data, isLoading, isError } = useGetAllHadithByPaginationQuery({
    page: currentPage,
    limit: 1,
    hadithPage: hadithPage,
    hadithLimit: 5,
  });


  const resetForm = () => {
    setFormData(initialFormData);
    setOpenAddHadithForm(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const updatedFormData = {
      language: formData.language,
      bookName: formData.bookName,
      partNumber: formData.partNumber,
      chapterNumber: formData.chapterNumber,
      hadithNumber: formData.hadithNumber,
      hadithText: formData.hadithText,
      translation: formData.translation,
      transliteration: formData.transliteration,
      note: formData.note,
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
      label: "Language",
      name: "language",
      componentType: "select",
      options:
        allLanguages &&
        allLanguages.data?.map((language) => ({
          id: language?.code,
          label: language?.name,
        })),
      allClasses: {
        selectClass:
          "w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary",
      },
    },
    {
      label: "Part Number",
      name: "partNumber",
      componentType: "input",
      type: "number",
      placeholder: "Enter Part Number",
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
      label: "Hadith Text",
      name: "hadithText",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Hadith Text",
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
  ];

  return (
    <div className="mt-12">
      <h1>Hadith Other</h1>
      <div className="flex justify-between mt-5">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-4 py-2 rounded-md border bg-adminInput focus:ring-2 focus:ring-primary"
        >
          {allLanguages?.data &&
            allLanguages.data?.map((language) => (
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
            setOpenAddHadithForm(true);
            setCurrentEditedId(null); // Ensure we're in "Add" mode
            setFormData(initialFormData);
          }}
        >
          Add New language Hadith
        </Button>
      </div>

      <div className="mt-10">
        {isError ? (
          <div>Error fetching data</div>
        ) : isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="">
            <div className="border border-gray-300 p-4">
              {data?.data?.map((hadith, index) => (
                <div className="border border-gray-300 p-4" key={index}>
                  <h2>Book Name: {hadith.bookName}</h2>
                  <div className="">
                    <p> Chapter Name: {hadith.chapterName}</p>
                    <p> Chapter Number: {hadith.chapterNumber}</p>
                  </div>
                  <div className="">
                    {hadith.parts.map((hadithItem, index) => (
                      <div key={index} className="">
                        <p>Part Name: {hadithItem.partName}</p>
                        <p>Part Number: {hadithItem.partNumber}</p>

                        <div className="">
                          {hadithItem.chapters.map((chapter, index) => (
                            <div className="" key={index}>
                              <p>Chapter Name: {chapter.chapterName}</p>
                              <p>Chapter Number: {chapter.chapterNumber}</p>

                              <div className="">
                                {chapter.hadithList.map((hadith, index) => (
                                  <div
                                    className="border border-gray-300 p-4 my-3 grid grid-cols-3 gap-5"
                                    key={index}
                                  >
                                    <p>Hadith Number: {hadith.hadithNumber}</p>
                                    <p>
                                      International Hadith Number:{" "}
                                      {hadith.internationalNumber}
                                    </p>
                                    <p>Hadith Arabic: {hadith.hadithArabic}</p>
                                    <p>
                                      Reference Book: {hadith.referenceBook}
                                    </p>
                                    <p>Similarities: {hadith.similarities}</p>
                                    <p>Translation: {hadith.translation}</p>
                                    <p>
                                      Transliteration: {hadith.transliteration}
                                    </p>
                                    <p>Narrator: {hadith.narrator}</p>
                                    <p>Note: {hadith.note}</p>

                                    <div className="">
                                      {hadith.hadithOtherLanguage.map(
                                        (item, index) => {
                                          const selectedLanguageData =
                                            item.language === selectedLanguage
                                              ? item
                                              : null;
                                          return selectedLanguageData ? (
                                            <li key={index}>
                                              <p>
                                                Language:{" "}
                                                {selectedLanguageData.language}
                                              </p>
                                              <p>
                                                Hadith Text:{" "}
                                                {
                                                  selectedLanguageData.hadithText
                                                }
                                              </p>
                                              <p>
                                                Similarities:{" "}
                                                {
                                                  selectedLanguageData.similarities
                                                }
                                              </p>
                                              <p>
                                                Translation:{" "}
                                                {
                                                  selectedLanguageData.translation
                                                }
                                              </p>
                                              <p>
                                                Transliteration:{" "}
                                                {
                                                  selectedLanguageData.transliteration
                                                }
                                              </p>
                                              <p>
                                                Note:{" "}
                                                {selectedLanguageData.note}
                                              </p>
                                            </li>
                                          ) : null;
                                        }
                                      )}
                                    </div>
                                  </div>
                                ))}
                                <div className="p-4 flex justify-center">
                                  <Pagination className="px-4">
                                    <PaginationContent>
                                      <PaginationItem>
                                        <PaginationPrevious
                                          aria-label="Go to previous hadith page"
                                          onClick={() =>
                                            setHadithPage(() =>
                                              hadithPage == 1
                                                ? 1
                                                : hadithPage - 1
                                            )
                                          }
                                          className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                                          disabled={hadithPage == 1}
                                        />
                                      </PaginationItem>
                                      <PaginationItem>
                                        <PaginationEllipsis />
                                      </PaginationItem>
                                      <PaginationItem>
                                        <Button
                                          className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                                          onClick={() =>
                                            setHadithPage(hadithPage + 5)
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
                                          aria-label="Go to next hadith page"
                                          onClick={() =>
                                            setHadithPage(hadithPage + 1)
                                          }
                                          className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                                        />
                                      </PaginationItem>
                                    </PaginationContent>
                                  </Pagination>
                                </div>
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
                  setCurrentPage(() => (currentPage == 1 ? 1 : currentPage - 1))
                }
                className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                disabled={currentPage == 1}
              />
            </PaginationItem>
            {/* <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem> */}
            {/* <PaginationItem>
                <Button
                  className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                  onClick={() => setCurrentPage(currentPage + 5)}
                >
                  Skip
                </Button>
              </PaginationItem> */}
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
    </div>
  );
}
