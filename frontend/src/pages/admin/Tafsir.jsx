import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import CommonForm from "@/components/common/Form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "react-toastify";
import {
  useAddTafsirMutation,
  useEditTafsirMutation,
  useDeleteTafsirMutation,
  useGetAllTafsirPaginatedQuery,
} from "@/slices/admin/tafsir";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  const [bookName, setBookName] = useState("Sahih International");
  const [language, setLanguage] = useState("en");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVerseNumber, setTotalVerseNumber] = useState(1);

  const [addTafsir] = useAddTafsirMutation();
  const [editTafsir] = useEditTafsirMutation();
  const [deleteTafsir] = useDeleteTafsirMutation();

  const { data, isLoading, refetch } = useGetAllTafsirPaginatedQuery({
    language: language,
    bookName: bookName,
    page: currentPage,
    limit: 10,
  });
  console.log(data, "tafsir data");

  const allTafsir = data?.data || [];

  const resetForm = () => {
    setFormData(initialFormData);
    setOpenAddTafsirForm(false);
  };

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

    console.log(updatedFormData);

    const editFormData = {
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
      } else {
        const addResponse = await addTafsir(updatedFormData).unwrap();
        // Show success or error messages based on the response
        if (addResponse.error) {
          toast.error(addResponse.error.message);
        } else {
          toast.success(addResponse.message || "Tafsir added successfully!");
          resetForm();
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
      allClasses: {
        selectClass:
          "w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary cursor-pointer",
      },
    },
    {
      label: "Book Name",
      name: "bookName",
      componentType: "input",
      type: "text",
      placeholder: "Enter Book Name",
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

  // const allTafsir = [
  //   {
  //     id: "01",
  //     Name: "Al-Fatihah",
  //     btn: "Edit",
  //     delete: "Delete",
  //   },
  //   {
  //     id: "02",
  //     Name: "Al-Baqarah",
  //     btn: "Edit",
  //     delete: "Delete",
  //   },
  //   {
  //     id: "03",
  //     Name: "Al-Imran",
  //     btn: "Edit",
  //     delete: "Delete",
  //   },
  //   {
  //     id: "04",
  //     Name: "An-Nisa",
  //     btn: "Edit",
  //     delete: "Delete",
  //   },
  //   {
  //     id: "004",
  //     Name: "An-Nisa",
  //     btn: "Edit",
  //     delete: "Delete",
  //   },
  // ];

  return (
    <section className="px-10">
      <div className="mt-12">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 rounded-md border bg-white focus:ring-2 focus:ring-primary"
            >
              <option className="bg-primary/50 text-white" key="en" value="en">
                English
              </option>
              <option className="bg-primary/50 text-white" key="bn" value="bn">
                Bangla
              </option>
            </select>
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
            {allTafsir.map((tafsir, index) => (
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
                  <button className="px-6 py-2 flex items-center gap-2 text-xl font-semibold text-white bg-primary rounded-md hover:bg-primary-foreground hover:text-black transition duration-200">
                    Edit
                    <FaEdit className="text-xl font-semibold" />
                  </button>
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
            setFormData={setFormData}
            buttonText={currentEditedId ? "Save Changes" : "Add Tafsir"}
            formControls={addTafsirFormElements}
          />
        </SheetContent>
      </Sheet>
    </section>
  );
}
