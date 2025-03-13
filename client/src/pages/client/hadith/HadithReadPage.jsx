import { useParams } from "react-router-dom";
import allahSymbol from "@/assets/icon/allah-symbol.png";
import { useGetHadithsQuery } from "../../../slices/admin/hadith";
import { booksList } from "../../../constant";
import { toast } from "react-toastify";

export default function HadithReadPage() {
  const { number, id } = useParams();
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

  return (
    <section className="pt-[4.5rem] pb-[4.5rem]">
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

      {selectedPart?.chapters?.map((chapter, index) => (
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
                  <h2 className="text-sm capitalize">{hadith.translation} </h2>
                </div>
                <h2 className="max-w-xl text-3xl">{hadith.hadithArabic} </h2>
              </div>
              <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between gap-5 mt-5">
                <div className="text-xs md:text-sm">
                  <p>
                    Rrference :{" "}
                    <span className="text-primary">{hadith.referenceBook}</span>
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
      ))}
    </section>
  );
}
