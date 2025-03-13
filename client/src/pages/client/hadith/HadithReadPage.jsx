import { useParams } from "react-router-dom";
import allahSymbol from "@/assets/icon/allah-symbol.png";
import { useGetHadithsQuery } from "../../../slices/admin/hadith";
import { booksList } from "../../../constant";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorldIcon from "@/assets/icon/world-icon.png";
import Loading from "@/components/common/Loading";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetAllLanguagesQuery } from "@/slices/utils";

export default function HadithReadPage() {
  const { number, id } = useParams();
  const [openSheet, setOpenSheet] = useState(false);
  const { data: languages } = useGetAllLanguagesQuery();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedLanguageName, setSelectedLanguageName] = useState("English");
  const shareLink = window.location.href;
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
    language: "en",
  });
  const hadiths = data?.data || [];

  const selectedPart = hadiths?.parts?.find(
    (part) => part.partNumber === Number(number)
  );
  console.log(selectedPart);

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
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

        {/* {selectedPart?.chapters?.map((chapter, index) => (
          <div key={index} className="my-10">
            <div className="bg-gray-200 py-10">
              <div className="container px-4  mx-auto flex flex-col md:flex-row justify-between gap-5 text-xl text-black md:text-2xl font-medium">
                <h1 className="max-w-xl">
                  {chapter.chapterName}{" "}
                  <span className="text-primary font-bold">
                    Chapter no. {chapter.chapterNumber}{" "}
                  </span>{" "}
                </h1>
                <h1 className="max-w-xl text-3xl">
                  {hadith.hadithChapterArabic}{" "}
                </h1>
              </div>
            </div>
            {chapter.hadithList?.map((hadith, index) => (
              <div
                className="my-10 py-5 bg-gray-200 px-2 md:px-0 text-xl text-black md:text-2xl font-medium"
                key={index}
              >
                <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between gap-5">
                  <div className="max-w-xl">
                    <h3 className="text-sm font-bold capitalize md:text-base mb-2">
                      Narrated by: {hadith.narrator}
                    </h3>
                    <h2 className="text-sm capitalize">
                      {hadith.translation}{" "}
                    </h2>
                  </div>
                  <h2 className="max-w-xl text-3xl " dir="rtl">{hadith.hadithArabic} </h2>
                </div>
                <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between gap-5 mt-5">
                  <div className="text-xs md:text-sm">
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
                  <div className="flex gap-2 text-xs md:text-sm">
                    <p>Report Error |</p>
                    <p
                      onClick={copyToClipboard}
                      className="cursor-pointer hover:text-primary duration-500 transition-all ease-linear"
                    >
                      Share
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))} */}

        <div className="mt-10 ">
          <Tabs defaultValue="arabic">
            <TabsList className="flex justify-between w-full gap-2 h-full items-center">
              <div className="grid grid-cols-2 gap-2">
                <TabsTrigger
                  value="arabic"
                  className="data-[state=active]:border rounded-t-lg data-[state=active]:border-black py-2 border-primary bg-none data-[state=active]:rounded-b-none data-[state=active]:rounded-t-lg data-[state=active]:bg-transparent data-[state=active]:text-black text-xs sm:text-sm md:text-base lg:text-lg"
                >
                  Arabic / {selectedLanguageName}
                </TabsTrigger>
                <TabsTrigger
                  value="translation"
                  className="h-full data-[state=active]:border rounded-t-lg data-[state=active]:border-black py-2 border-primary bg-none data-[state=active]:rounded-b-none data-[state=active]:rounded-t-lg data-[state=active]:bg-transparent data-[state=active]:text-black text-xs sm:text-sm md:text-base lg:text-lg"
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
              {selectedPart?.chapters?.map((chapter, index) => (
                <div key={index} className="my-10">
                  {/* chapter title */}
                  <div className="border-black border py-5">
                    <div className="container px-4  mx-auto flex flex-col md:flex-row justify-between gap-5 text-xl text-black md:text-2xl font-medium">
                      <h1 className="max-w-xl">
                        {chapter.chapterName}{" "}
                        <span className="text-primary font-bold">
                          Chapter no. {chapter.chapterNumber}{" "}
                        </span>{" "}
                      </h1>
                      <div className=" bg-black w-[2px]"></div>

                      <h1 className="max-w-xl text-3xl">
                        {hadith.hadithChapterArabic}{" "}
                      </h1>
                    </div>
                  </div>
                  <div className="border-black border py-5 my-5 px-3">
                    <h2 className="text-2xl font-bold">Quranic:</h2>
                  </div>
                  {/* hadith list */}
                  {chapter.hadithList?.map((hadith, index) => (
                    <div
                      className="my-10 py-5 px-2 md:px-0 text-xl text-black md:text-2xl font-medium"
                      key={index}
                    >
                      <div className="container border-black border py-5 px-4 mx-auto flex flex-col md:flex-row justify-between gap-5">
                        <div className="max-w-xl">
                          <h3 className="text-sm font-bold capitalize md:text-base mb-2">
                            Narrated by: {hadith.narrator}
                          </h3>
                          <h2 className="text-2xl capitalize">
                            {hadith.hadithText}{" "}
                          </h2>
                        </div>
                        <div className=" bg-black w-[2px]"></div>
                        <h2 className="max-w-xl text-3xl " dir="rtl">
                          {hadith.hadithArabic}{" "}
                        </h2>
                      </div>
                      <div className="container border-black border px-4 mx-auto flex py-5 flex-col md:flex-row justify-between items-end gap-5 mt-5">
                        <div className="text-xs md:text-sm">
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
                        <div className="flex gap-2 text-xs md:text-sm">
                          <p className="cursor-pointer border border-black p-2">
                            Report Error
                          </p>
                          <p
                            onClick={copyToClipboard}
                            className="cursor-pointer border border-black p-2 hover:text-primary duration-500 transition-all ease-linear"
                          >
                            Share
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </TabsContent>
            <TabsContent
              className="mt-0 data-[state=active]:rounded-lg"
              value="translation"
            >
              <div className=" text-center">
                <div className="text-black w-full mx-auto leading-relaxed text-justify">
                  {selectedPart?.chapters?.map((chapter, index) => (
                    <div key={index} className="mt-10 border-black border">
                      {chapter.hadithList?.map((hadith, index) => (
                        <div
                          className="my-10 py-5 px-2 md:px-0 text-xl text-black md:text-2xl font-medium"
                          key={index}
                        >
                          <div className=" py-5 px-4 mx-auto gap-5">
                            <h3 className="text-sm font-bold capitalize md:text-base mb-2">
                              Narrated by: {hadith.narrator}
                            </h3>
                            <h2 className="text-2xl capitalize">
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
                className={`px-4 py-2 m-2 ${
                  selectedLanguage === lang
                    ? "bg-green-500 text-black"
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
