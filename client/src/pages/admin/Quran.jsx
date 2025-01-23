import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddVerseMutation } from "@/slices/admin";
import { useState } from "react";
import CommonForm from "@/components/common/Form";
import { toast } from "react-toastify";

const initialFormData = {
  chapterNumber: "",
  surahNumber: "",
  surahName: "",
  verseNumber: "",
  arabicText: "",
  translations: [],
  transliteration: [],
};

export default function Quran() {
  const [addVerse, { isLoading }] = useAddVerseMutation();
  const [formData, setFormData] = useState(initialFormData);

  const addQuran = async (event) => {
    event.preventDefault();
    try {
      const result = await addVerse(formData).unwrap();
      toast.success(result?.message);
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(error.data?.message || "An error occurred");
    }
  };

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
      fields: ["ban", "eng"],
    },
    {
      name: "transliteration",
      label: "Transliteration",
      componentType: "multiObjectTextarea",
      fields: ["ban", "eng"],
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
      No: 2335,
      Name: "Al-Maidah",
      btn: "Edit",
      delete: "Delete",
    },
    {
      No: 20000,
      Name: "Al-Maidah",
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
      No: 2335,
      Name: "Al-Maidah",
      btn: "Edit",
      delete: "Delete",
    },
    {
      No: 20000,
      Name: "Al-Maidah",
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
      No: 2335,
      Name: "Al-Maidah",
      btn: "Edit",
      delete: "Delete",
    },
    {
      No: 20000,
      Name: "Al-Maidah",
      btn: "Edit",
      delete: "Delete",
    },
  ];

  return (
    <Tabs defaultValue="add-quran" className="pl-8 scrollbar-none pr-12">
      {/* Tabs List */}
      <TabsList className="rounded-none rounded-bl-sm rounded-br-sm">
        <TabsTrigger className="text-white font-medium" value="add-quran">
          Add Quran
        </TabsTrigger>
        <TabsTrigger className="text-white font-medium" value="all-quran">
          All Quran
        </TabsTrigger>
      </TabsList>

      {/* Add Quran Tab Content */}
      <TabsContent value="add-quran">
        <main>
          <div className="">
            <h1 className="text-3xl font-semibold text-center">Add Verse</h1>
            <CommonForm
              layout={2}
              allClasses={{
                formClass:
                  "grid grid-cols-2 gap-5 mt-10 py-10 px-16 bg-primary-foreground rounded-lg shadow-lg",
                inputClass:
                  "w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary",
              }}
              onSubmit={addQuran}
              formData={formData}
              setFormData={setFormData}
              isLoading={isLoading}
              buttonText={"Add Verse"}
              formControls={addVerseFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </main>
      </TabsContent>

      {/* All Quran Tab Content */}
      <TabsContent value="all-quran">
        <div className="mt-12">
          <div>
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
                    <button className="px-6 py-2 flex items-center gap-2 text-xl font-semibold text-white bg-primary rounded-md hover:bg-primary-foreground hover:text-black transition duration-200">
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
      </TabsContent>
    </Tabs>
  );
}
