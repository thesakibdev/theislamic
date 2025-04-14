import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import CommonForm from "@/components/common/Form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
// import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import {
  useAddTafsirMutation,
  useEditTafsirMutation,
  useDeleteTafsirMutation,
  useGetAllTafsirPaginatedQuery,
} from "@/slices/admin/tafsir";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { tafsirBooksList } from "@/constant";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Swal from "sweetalert2";

const initialFormData = {
  bookName: "",
  language: "en",
  totalVerseNumber: "",
  mainContent: "",
  OtherLanguageContent: "",
  note: "",
};

export default function Tafsir() {
  const [openAddTafsirForm, setOpenAddTafsirForm] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [bookName, setBookName] = useState("");
  const [language, setLanguage] = useState("bn");
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalVerseNumber, setTotalVerseNumber] = useState(1);

  const [addTafsir] = useAddTafsirMutation();
  const [editTafsir] = useEditTafsirMutation();
  const [deleteTafsir] = useDeleteTafsirMutation();

  const { data, isLoading, refetch } = useGetAllTafsirPaginatedQuery({
    language: language,
    bookName: bookName,
    page: currentPage,
    limit: 10,
  });

  const allTafsir = data?.data || [];
  console.log(allTafsir);

  const resetForm = () => {
    setFormData(initialFormData);
    setOpenAddTafsirForm(false);
  };

  // Add state to track selected language
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Handler for language change
  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    setFormData({
      ...formData,
      language: value,
      bookName: "",
    });
  };

  // on submit
  const onSubmit = async (event) => {
    event.preventDefault();

    const updatedFormData = {
      bookName: formData.bookName,
      language: formData.language,
      tafsirData: {
        totalVerseNumber: formData.totalVerseNumber,
        mainContent: formData.mainContent,
        OtherLanguageContent: formData.OtherLanguageContent,
        note: formData.note,
      },
    };

    const editFormData = {
      totalVerseNumber: formData.totalVerseNumber,
      mainContent: formData.mainContent,
      OtherLanguageContent: formData.OtherLanguageContent,
      note: formData.note,
    };

    try {
      if (currentEditedId !== null) {
        const editResponse = await editTafsir({
          id: currentEditedId,
          bookName: formData.bookName,
          language: formData.language,
          ...editFormData,
        }).unwrap();
        toast.success(editResponse.message || "Tafsir updated successfully!");
        resetForm();
        refetch();
      } else {
        const addResponse = await addTafsir(updatedFormData).unwrap();
        // Show success or error messages based on the response
        if (addResponse.error) {
          toast.error(addResponse.error.message);
        } else {
          toast.success(addResponse.message || "Tafsir added successfully!");
          resetForm();
          refetch();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.data?.message || "Something went wrong! Please try again."
      );
    }
  };

  const addTafsirFormElements = [
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
      ],
    },
    {
      label: "Tafsir Book Name",
      name: "bookName",
      componentType: "select",
      options:
        tafsirBooksList &&
        tafsirBooksList.map((book) => ({
          id: selectedLanguage === "en" ? book?.nameEn : book?.nameBn,
          label: selectedLanguage === "en" ? book?.nameEn : book?.nameBn,
        })),
    },
    {
      label: "Total Verse Number",
      name: "totalVerseNumber",
      componentType: "input",
      type: "number",
      placeholder: "Enter Total Verse Number",
    },
    {
      label: "Note",
      name: "note",
      componentType: "input",
      type: "text",
      placeholder: "Enter Note",
    },
    {
      label: "Main Tafsir",
      name: "mainContent",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Main Tafsir Name",
    },
    {
      label: "Other Language Content",
      name: "OtherLanguageContent",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter Other Language Content",
    },
  ];

  // Pagination
  const handlePaginationNext = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaginationPrev = () => {
    setCurrentPage(() => (currentPage == 1 ? 1 : currentPage - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteTafsir = async (tafsirId, bookName, language) => {
    try {
      const result = await Swal.fire({
        title: "আপনি কি নিশ্চিত?",
        text: `"${bookName}" থেকে এই তাফসির ডিলিট করতে চান?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
        cancelButtonText: "না, থাক",
        background: "#fff",
        customClass: {
          title: "text-xl font-semibold",
          popup: "rounded-lg",
          confirmButton: "rounded-md px-4 py-2",
          cancelButton: "rounded-md px-4 py-2",
        },
      });

      if (result.isConfirmed) {
        const deleteResponse = await deleteTafsir({
          language: language,
          id: tafsirId,
          bookName: bookName,
        }).unwrap();

        Swal.fire({
          title: "ডিলিট করা হয়েছে!",
          text: deleteResponse.message || "তাফসির সফলভাবে ডিলিট করা হয়েছে।",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ঠিক আছে",
        });

        refetch();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "ত্রুটি!",
        text: error?.data?.message || "কিছু একটা ভুল হয়েছে! আবার চেষ্টা করুন।",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ঠিক আছে",
      });
    }
  };

  useEffect(() => {
    if (bookName === "" || bookName === undefined) {
      setBookName(tafsirBooksList[0]?.nameBn);
    }
  }, [bookName]);

  return (
    <section className="px-10">
      <div className="mt-12">
        {/* tafsir filter and add button */}
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value)}
              className="px-4 py-2 rounded-md border bg-white focus:ring-2 focus:ring-primary"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="bg-primary/50 text-white cursor-pointer"
                  key="en"
                  value="en"
                >
                  English
                </SelectItem>
                <SelectItem
                  className="bg-primary/50 text-white cursor-pointer"
                  key="bn"
                  value="bn"
                >
                  Bangla
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={bookName}
              name="bookName"
              id="bookName"
              onValueChange={(value) => {
                console.log("Selected value:", value);
                setBookName(value);
              }}
              className="px-4 py-2 rounded-md border bg-white focus:ring-2 focus:ring-primary"
            >
              <SelectTrigger className="">
                <SelectValue
                  placeholder={
                    language === "en"
                      ? "Select A Book Name"
                      : "একটি বইয়ের নাম নির্বাচন করুন"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {tafsirBooksList &&
                  tafsirBooksList.map((book, index) => (
                    <SelectItem
                      key={index}
                      className="bg-primary/50 text-white cursor-pointer"
                      value={language === "en" ? book.nameEn : book.nameBn}
                    >
                      {language === "en" ? book.nameEn : book.nameBn}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="bg-primary text-white"
            onClick={() => {
              setOpenAddTafsirForm(true);
              setCurrentEditedId(null);
              setFormData(initialFormData);
            }}
          >
            Add New Tafsir
          </Button>
        </div>

        {/* tafsir list */}
        <div>
          {/* heading */}
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center w-full">
              <p className="font-semibold text-2xl w-36 font-sans">No.</p>
              <p className="font-semibold text-2xl font-sans">Name</p>
            </div>
          </div>

          {/* content */}
          <div className="pb-10">
            {isLoading ? (
              <p>Loading...</p>
            ) : allTafsir.length === 0 ? (
              <p className="text-center text-2xl font-semibold text-gray-500 py-4">
                কোন ডাটা পাওয়া যায়নি
              </p>
            ) : (
              allTafsir.map((tafsir, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center">
                    <div className="font-semibold text-2xl w-36 font-sans">
                      {tafsir.totalVerseNumber}
                    </div>
                    <div className="font-semibold text-2xl font-sans">
                      {tafsir.surahName}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-12">
                    <Button
                      onClick={() => {
                        setCurrentEditedId(tafsir?.tafsirId);
                        setOpenAddTafsirForm(true);
                        setFormData({
                          bookName: tafsir?.bookName,
                          language: tafsir?.language,
                          totalVerseNumber: tafsir?.totalVerseNumber,
                          mainContent: tafsir?.mainContent,
                          OtherLanguageContent: tafsir?.OtherLanguageContent,
                          note: tafsir?.note,
                        });
                      }}
                      className="px-6 py-2 flex items-center gap-2 text-xl font-semibold text-white bg-primary rounded-md hover:bg-primary-foreground hover:text-black transition duration-200"
                    >
                      Edit
                      <FaEdit className="text-xl font-semibold" />
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeleteTafsir(
                          tafsir?.tafsirId,
                          tafsir?.bookName,
                          tafsir?.language
                        )
                      }
                      className="px-6 py-2 font-semibold text-xl flex items-center gap-2 text-white bg-deleteRed rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Delete <RiDeleteBinLine />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* pagination button */}
        <div className="flex justify-center">
          <Pagination className="px-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  aria-label="Go to previous page"
                  onClick={handlePaginationPrev}
                  className="bg-white hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-black px-6 py-2 rounded-lg border border-black hover:border-primary cursor-pointer"
                  disabled={currentPage == 1}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <Button className="bg-white hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-black px-6 py-2 rounded-lg border border-black hover:border-primary cursor-pointer">
                  Skip
                </Button>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  aria-label="Go to next page"
                  onClick={handlePaginationNext}
                  className="bg-white hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-black px-6 py-2 rounded-lg border border-black hover:border-primary cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <Sheet
        open={openAddTafsirForm}
        onOpenChange={(isOpen) => setOpenAddTafsirForm(isOpen)}
      >
        <SheetContent side="right" className="overflow-auto w-[90%]">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Edit Tafsir" : "Add Tafsir"}
            </SheetTitle>
          </SheetHeader>
          <CommonForm
            allClasses={{
              formClass:
                "grid grid-cols-2 gap-5 mt-10 py-10 px-16 bg-primary-foreground rounded-lg shadow-lg",
              inputClass:
                "w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary",
              textareaClass:
                "w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary",
              btnClass: "text-white mt-5",
            }}
            onSubmit={onSubmit}
            formData={formData}
            setFormData={(newData) => {
              // Handle special case for language changes to trigger the language change handler
              if (newData.language !== formData.language) {
                handleLanguageChange(newData.language);
              } else {
                setFormData(newData);
              }
            }}
            buttonText={currentEditedId ? "Save Changes" : "Add Tafsir"}
            formControls={addTafsirFormElements}
          />
        </SheetContent>
      </Sheet>
    </section>
  );
}
