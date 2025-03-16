import { useParams } from "react-router-dom";
import allahSymbol from "@/assets/icon/allah-symbol.png";
import { useGetHadithsQuery } from "../../../slices/admin/hadith";
import { booksList } from "../../../constant";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorldIcon from "@/assets/icon/world-icon.png";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetAllLanguagesQuery } from "@/slices/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HadithReadPage() {
  const { number, id } = useParams();
  const [openSheet, setOpenSheet] = useState(false);
  const { data: languages } = useGetAllLanguagesQuery();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedLanguageName, setSelectedLanguageName] = useState("English");
  const shareLink = window.location.href;

  // report error
  const [showErrorForm, setShowErrorForm] = useState(null);
  const [otherError, setOtherError] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy link!");
    }
  };

  const selectedBookName = booksList?.find((book) => book.id === id);

  // const { data: bookList } = useGetAllBookListQuery();
  const { data, error, isLoading, refetch } = useGetHadithsQuery({
    bookName: selectedBookName?.nameEn,
    language: selectedLanguage,
  });
  const hadiths = data?.data || [];

  const selectedPart = hadiths?.parts?.find(
    (part) => part.partNumber === Number(number)
  );

  if (isLoading) {
    return (
      <section className="pt-[4.5rem] pb-[4.5rem]">
        <div className="container mx-auto px-4 sm:px-0">
          <div className="flex justify-center items-center h-40">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2">Loading hadiths...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-[4.5rem] pb-[4.5rem]">
        <div className="container mx-auto px-4 sm:px-0">
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mt-10">
            <p>Error loading hadith data: {error.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  const hadith = {
    title: "Revelation",
    hadithArabic: "كتاب بدء الوحي",
    hadithNo: 1,
    hadithChapter:
      "Chapter: How the Divine Revelation started being revealed to Allah's Messenger..",
    hadithChapterArabic:
      "باب كَيْفَ كَانَ بَدْءُ الْوَحْىِ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم",
    hadithPara1: `Narrated 'Umar bin Al-Khattab:I heard Allah's Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for.`,
    hadithPara1Arabic: `حَدَّثَنَاالْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ، قَالَ : حَدَّثَنَاسُفْيَانُ، قَالَ : حَدَّثَنَايَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ، قَالَ : أَخْبَرَنِيمُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ، أَنَّهُ سَمِعَعَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ، يَقُولُ : سَمِعْتُعُمَرَ بْنَ الْخَطَّابِرَضِيَ اللَّهُ عَنْهُ عَلَى الْمِنْبَرِ، قَالَ : سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، يَقُولُ : "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى`,
    hadithPara2: `Narrated 'Umar bin Al-Khattab:I heard Allah's Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for.`,
    hadithPara2Arabic: `حَدَّثَنَاالْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ، قَالَ : حَدَّثَنَاسُفْيَانُ، قَالَ : حَدَّثَنَايَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ، قَالَ : أَخْبَرَنِيمُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ، أَنَّهُ سَمِعَعَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ، يَقُولُ : سَمِعْتُعُمَرَ بْنَ الْخَطَّابِرَضِيَ اللَّهُ عَنْهُ عَلَى الْمِنْبَرِ، قَالَ : سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، يَقُولُ : "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى`,
  };

  const toggleErrorForm = (id) => {
    console.log(id);
    setShowErrorForm((prevId) => (prevId === id ? null : id));
  };

  return (
    <section>
      <div className="py-16 container mx-auto">
        {/* heading */}
        <div className="container px-4 mx-auto  grid grid-cols-3 justify-between items-center py-2">
          <h1 className="text-lg md:text-3xl font-bold">
            {selectedPart?.partName}
          </h1>
          <div className="flex items-center justify-center">
            <img className="w-10 h-10" src={allahSymbol} alt="allah symbol" />
          </div>
          <div className="flex justify-end rtl">
            <p className="text-right text-lg md:text-3xl font-arabic font-bold">
              {hadith.hadithArabic}
            </p>
          </div>
        </div>

        {/* hadith */}

        <div className="container px-4 mx-auto">
          <div className="mt-10 ">
            <Tabs defaultValue="arabic">
              <TabsList className="flex justify-between w-full gap-2 h-full items-center">
                <div className="grid grid-cols-2 gap-2">
                  <TabsTrigger
                    value="arabic"
                    className="data-[state=active]:border rounded-lg data-[state=active]:border-black py-2 border-primary bg-none data-[state=active]:rounded-b-none data-[state=active]:rounded-lg data-[state=active]:bg-transparent data-[state=active]:text-black text-xs sm:text-sm md:text-base lg:text-lg"
                  >
                    Arabic / {selectedLanguageName}
                  </TabsTrigger>
                  <TabsTrigger
                    value="translation"
                    className="h-full data-[state=active]:border rounded-lg data-[state=active]:border-black py-2 border-primary bg-none data-[state=active]:rounded-b-none data-[state=active]:rounded-lg data-[state=active]:bg-transparent data-[state=active]:text-black text-xs sm:text-sm md:text-base lg:text-lg"
                  >
                    {selectedLanguageName}
                  </TabsTrigger>
                </div>
                <div className="flex justify-end md:mb-1">
                  <div
                    onClick={() => setOpenSheet(true)}
                    className="group relative flex items-center bg-primary bg-opacity-50 px-2 py-1 md:py-2 text-white w-8 md:w-10 transition-all duration-500 ease-in-out justify-center overflow-visible rounded-lg cursor-pointer"
                  >
                    <img
                      src={WorldIcon}
                      alt="theislamics/change-language-icon"
                      className="w-[19px] h-[19px] md:h-6 md:w-6"
                    />
                    <span className="absolute right-[10px] opacity-0 bg-primary/50 px-2 py-1 rounded-md group-hover:opacity-100 group-hover:right-9 md:group-hover:right-11 transition-all duration-500 whitespace-nowrap text-[10px] sm:text-sm md:text-base lg:text-lg font-normal">
                      Change Language
                    </span>
                  </div>
                </div>
              </TabsList>
              <TabsContent
                className="mt-0 data-[state=active]:rounded-b-lg data-[state=active]:rounded-r-lg"
                value="arabic"
              >
                <div className="">
                  {selectedPart?.chapters?.map((chapter, index) => (
                    <div key={index} className="my-7">
                      {/* chapter title */}
                      <div className="border-black rounded-md border py-5 mb-5">
                        <div className="px-4 flex flex-col md:flex-row justify-between gap-5 text-xl text-black md:text-2xl font-medium">
                          <h1 className="w-full md:w-1/2 text-justify">
                            {chapter.chapterName}{" "}
                            <span className="text-primary font-bold">
                              Chapter no. {chapter.chapterNumber}{" "}
                            </span>{" "}
                          </h1>
                          <div className=" bg-black w-[1px]"></div>

                          <h1
                            dir="rtl"
                            className="w-full md:w-1/2 text-justify text-3xl"
                          >
                            {hadith.hadithChapterArabic}{" "}
                          </h1>
                        </div>
                      </div>
                      {/* hadith list */}
                      {chapter.hadithList?.map((hadith, index) => (
                        <div
                          className="text-xl text-black md:text-2xl font-medium"
                          key={index}
                        >
                          {/* quranic data */}
                          {hadith?.quranic?.trim() && (
                            <div className="border-black rounded-md border py-5 my-5 px-3">
                              <p className="">
                                <span className="text-2xl font-bold">
                                  Quranic:
                                </span>{" "}
                                {hadith?.quranic}
                              </p>
                            </div>
                          )}

                          <div className="border-black rounded-md border px-4 py-5 flex flex-col md:flex-row justify-between gap-5">
                            <div className="w-full md:w-1/2">
                              <h3 className="text-sm font-bold capitalize md:text-base mb-2">
                                Narrated by: {hadith.narrator}
                              </h3>
                              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-justify capitalize">
                                {hadith.hadithText}{" "}
                              </h2>
                            </div>
                            <div className=" bg-black w-[1px]"></div>
                            <h2
                              className="w-full md:w-1/2 text-3xl border-black border-t-2 pt-5 md:border-t-0 text-justify"
                              dir="rtl"
                            >
                              {hadith.hadithArabic}{" "}
                            </h2>
                          </div>

                          {/* note */}
                          {hadith?.note.trim() && (
                            <div className="border-black rounded-md border py-5 my-5 px-3">
                              <h2 className="text-xl md:text-2xl font-semibold">Note:</h2>
                              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-justify capitalize">
                                {hadith.note}
                              </p>
                            </div>
                          )}

                          {/* reference  */}
                          <div className="border-black rounded-md border my-5">
                            <div
                              className={cn(
                                "relative flex px-4 py-5 pb-10 md:pb-5 flex-col md:flex-row justify-between items-end gap-5",
                                showErrorForm === hadith?.id &&
                                  "border-b border-black rounded-md"
                              )}
                            >
                              <div className="text-lg md:text-xl flex flex-col gap-2">
                                <p>
                                  Rrference :{" "}
                                  <span className="text-primary">
                                    {hadith.referenceBook}
                                  </span>
                                </p>
                                <p>
                                  In-book reference :{" "}
                                  <span>Book {selectedPart?.partNumber}</span>{" "}
                                  <span>Hadith {hadith.hadithNumber}</span>
                                </p>
                              </div>
                              {/* error report */}
                              <div className="flex absolute right-0 bottom-0 gap-2 text-xs md:text-sm">
                                <p
                                  onClick={() => toggleErrorForm(hadith?.id)}
                                  className="cursor-pointer border-black border border-b-0 p-2 hover:border-primary hover:text-primary duration-500 transition-all ease-linear"
                                >
                                  Report Error
                                </p>
                                <p
                                  onClick={copyToClipboard}
                                  className="cursor-pointer border-black border border-b-0 border-r-0 p-2 hover:border-primary hover:text-primary duration-500 transition-all ease-linear"
                                >
                                  Share
                                </p>
                              </div>
                            </div>
                            {/* report form  */}
                            <div
                              className={cn(
                                " transition-all duration-500 ease-in-out px-5",
                                showErrorForm === hadith?.id
                                  ? "h-auto opacity-100 my-5 visible"
                                  : "h-0 opacity-0 my-0 py-0 hidden"
                              )}
                            >
                              <div className="border border-black rounded-md p-5 mt-3">
                                <h3 className="text-xl font-bold mb-4">
                                  Report an Error
                                </h3>

                                {/* Error Types */}
                                <div className="space-y-3">
                                  <Label>
                                    Type of error:{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  {[
                                    "Mismatched translation",
                                    "Spelling mistake",
                                    "Incomplete text",
                                    "Mistranslation",
                                  ].map((error, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2"
                                    >
                                      <input
                                        type="radio"
                                        name="errorType"
                                        className="accent-gray-700"
                                      />
                                      <Label>{error}</Label>
                                    </div>
                                  ))}
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name="errorType"
                                      className="accent-gray-700"
                                      onChange={() => setOtherError(true)}
                                    />
                                    <Label>Other (please specify)</Label>
                                  </div>
                                  {otherError && (
                                    <Input
                                      type="text"
                                      placeholder="Specify other error"
                                    />
                                  )}
                                </div>

                                {/* Additional Details */}
                                <div className="mt-4">
                                  <Label>Additional details:</Label>
                                  <Textarea placeholder="Describe the issue..." />
                                </div>

                                {/* Email Notify */}
                                <div className="flex items-center space-x-2 mt-4">
                                  <Checkbox id="email_notify" />
                                  <Label htmlFor="email_notify">
                                    Yes, email me when the error is corrected
                                  </Label>
                                </div>
                                <Input
                                  type="email"
                                  placeholder="Email address"
                                  className="mt-4"
                                />

                                {/* Submit Button */}
                                <Button className="w-full text-black mt-4 bg-green-600 hover:bg-green-500">
                                  SUBMIT
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent
                className="mt-0 data-[state=active]:rounded-lg"
                value="translation"
              >
                <div className=" text-center">
                  <div className="text-black w-full mx-auto leading-relaxed text-justify">
                    {selectedPart?.chapters?.map((chapter, index) => (
                      <div
                        key={index}
                        className="mt-10 border-black rounded-md border"
                      >
                        {chapter.hadithList?.map((hadith, index) => (
                          <div
                            className=" px-2 md:px-0 text-xl text-black md:text-2xl font-medium"
                            key={index}
                          >
                            <div className="p-4 md:py-6 px-4 mx-auto gap-2 md:gap-5">
                              <h3 className="text-sm font-bold capitalize md:text-base mb-2">
                                Narrated by: {hadith.narrator}
                              </h3>
                              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-justify capitalize">
                                {hadith.hadithText}{" "}
                              </h2>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Sheet open={openSheet} onOpenChange={(isOpen) => setOpenSheet(isOpen)}>
        <SheetContent className="bg-white">
          <SheetHeader>
            <SheetTitle>Translation</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col overflow-auto h-screen">
            {languages?.data?.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLanguage(lang.code);
                  setSelectedLanguageName(lang.name);
                  setOpenSheet(false);
                }}
                className={`px-4 py-2 m-2 hover:bg-primary hover:text-black rounded-md duration-500 transition-all ease-linear ${
                  selectedLanguage === lang
                    ? "bg-primary text-black"
                    : "bg-gray-200"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
