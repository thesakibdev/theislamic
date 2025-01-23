import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";

export default function Tafsir() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const addTafsir = (data) => {
    console.log("Form data", data);
    reset();
  };

  const allTafsir = [
    {
      id: "01",
      Name: "Al-Fatihah",
      btn: "Edit",
      delete: "Delete",
    },
    {
      id: "02",
      Name: "Al-Baqarah",
      btn: "Edit",
      delete: "Delete",
    },
    {
      id: "03",
      Name: "Al-Imran",
      btn: "Edit",
      delete: "Delete",
    },
    {
      id: "04",
      Name: "An-Nisa",
      btn: "Edit",
      delete: "Delete",
    },
    {
      id: "004",
      Name: "An-Nisa",
      btn: "Edit",
      delete: "Delete",
    },
  ];

  return (
    <Tabs defaultValue="add-tafsir" className="pl-8 scrollbar-none pr-12">
      {/* Tabs List */}
      <TabsList className="rounded-none rounded-bl-sm rounded-br-sm">
        <TabsTrigger className="text-white font-medium" value="add-tafsir">
          Add Tafsir
        </TabsTrigger>
        <TabsTrigger className="text-white font-medium" value="all-tafsir">
          All Tafsir
        </TabsTrigger>
      </TabsList>

      {/* Add tafsir Tab Content */}
      <TabsContent value="add-tafsir">
        <main>
          <div className="pb-20">
            <form onSubmit={handleSubmit(addTafsir)} className="space-y-10">
              {/* Input Fields */}
              <div className="py-10 px-16 bg-primary-foreground rounded-lg shadow-lg">
                {/* Meta Data Section */}
                <h2 className="text-4xl font-bold mb-6 text-center text-primary">
                  Meta Data
                </h2>
                <div className="grid grid-cols-3 gap-5 mt-10">
                  <div className="flex flex-col gap-2 relative">
                    <label className="block text-base font-semibold text-black">
                      Surah Name
                    </label>
                    {errors.surahName && (
                      <span className="absolute top-0 right-2 transition-transform duration-300 font-medium text-red-500 text-sm">
                        {errors.surahName.message}
                      </span>
                    )}
                    <input
                      {...register("surahName", {
                        required: "Surah Name is required",
                      })}
                      placeholder="Name"
                      className="w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 relative">
                    <label className="block text-base font-semibold text-black">
                      Surah No.
                    </label>
                    {errors.surahNumber && (
                      <span className="absolute top-0 right-2 transition-transform duration-300 font-medium text-red-500 text-sm">
                        {errors.surahNumber.message}
                      </span>
                    )}
                    <input
                      {...register("surahNumber", {
                        required: "Surah No. is required",
                      })}
                      placeholder="No."
                      type="number"
                      className="w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 relative">
                    <label className="block text-base font-semibold text-black">
                      Verse Number
                    </label>
                    {errors.verseNumber && (
                      <span className="absolute top-0 right-2 transition-transform duration-300 font-medium text-red-500 text-sm">
                        {errors.verseNumber.message}
                      </span>
                    )}
                    <input
                      {...register("verseNumber", {
                        required: " Verse Number is required",
                      })}
                      type="number"
                      placeholder="Number"
                      className="w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 relative">
                    <label className="block text-base font-semibold text-black">
                      Keywords
                    </label>
                    {errors.keywords && (
                      <span className="absolute top-0 right-2 transition-transform duration-300 font-medium text-red-500 text-sm">
                        {errors.keywords.message}
                      </span>
                    )}
                    <input
                      {...register("keywords", {
                        required: "Keywords is required",
                      })}
                      placeholder="keywords"
                      type="text"
                      className="w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              {/* Verse Section */}
              <div className="py-10 px-16 bg-primary-foreground rounded-lg shadow-lg">
                <h2 className="text-4xl font-bold mb-6 text-center text-primary">
                  Verse
                </h2>
                <div className="grid grid-cols-2 gap-6 mt-2">
                  <div className="relative">
                    <label className="block text-base font-semibold text-black mb-2">
                      Tafsri Name
                    </label>
                    {errors.tafsirName && (
                      <span className="absolute top-0 right-2 transition-transform duration-300 font-medium text-red-500 text-sm">
                        {errors.tafsirName.message}
                      </span>
                    )}
                    <textarea
                      {...register("tafsirName", {
                        required: "Tafsir Name is required",
                      })}
                      placeholder="Write here..."
                      rows="4"
                      className="w-full px-4 py-2 rounded-md resize-none border bg-adminInput outline-none focus:ring-2 focus:ring-primary-foreground"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-base font-semibold text-black mb-2">
                      Tafsir Content
                    </label>
                    {errors.tafsirContent && (
                      <span className="absolute top-0 right-2 transition-transform duration-300 font-medium text-red-500 text-sm">
                        {errors.tafsirContent.message}
                      </span>
                    )}
                    <textarea
                      {...register("tafsirContent", {
                        required: "Tafsir Content is required",
                      })}
                      placeholder="Write here..."
                      rows="4"
                      className="w-full px-4 py-2 resize-none rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="px-20 py-5 bg-gray-400 text-white text-xl font-semibold rounded-md hover:bg-gray-500 focus:outline-none cursor-pointer"
                  disabled
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-20 py-5 bg-primary text-xl font-semibold text-white rounded-md hover:bg-green-700 focus:outline-none"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </main>
      </TabsContent>

      {/* All Quran Tab Content */}
      <TabsContent value="all-tafsir">
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
              {allTafsir.map((quran, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center">
                    <div className="font-semibold text-2xl w-36 font-sans">
                      {quran.id}
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

          <div>
            {/* Heading */}
            <div>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className=" py-2 text-left font-semibold text-2xl font-sans w-36">
                      No.
                    </th>
                    <th className=" py-2 text-left font-semibold text-2xl font-sans">
                      Name
                    </th>
                    <th className=" py-2 font-semibold text-2xl font-sans text-right">
                      <select
                        name="filter"
                        className="bg-none text-sm text-black font-semibold rounded-md max-w-32 px-5 py-3 bg-white border outline-none border-black shadow-sm cursor-pointer transition ease-in-out duration-300"
                        id=""
                      >
                        <option value="all">Filter</option>
                        <option value="quranAyatArabic">
                          Quran Ayat Arabic
                        </option>
                        <option value="quranAyatEnglish">
                          Quran Ayat English
                        </option>
                      </select>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allTafsir.map((quran, index) => (
                    <tr key={index}>
                      <td className=" py-2 text-xl font-semibold text-left font-sans">
                        {quran.id}
                      </td>
                      <td className=" py-2 text-xl font-semibold text-left font-sans">
                        {quran.Name}
                      </td>
                      <td className=" py-2 text-xl font-semibold text-right">
                        <div className="flex justify-end items-center gap-12">
                          <button className="px-6 py-2 flex items-center gap-2 text-xl font-semibold text-white bg-primary rounded-md hover:bg-primary-foreground hover:text-black transition duration-200">
                            {quran.btn}
                            <FaEdit className="text-xl font-semibold" />
                          </button>
                          <button className="px-6 py-2 font-semibold text-xl flex items-center gap-2 text-white bg-deleteRed rounded-md hover:bg-red-600 transition duration-200">
                            {quran.delete} <RiDeleteBinLine />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
