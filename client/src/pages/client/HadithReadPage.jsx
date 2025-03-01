import { useParams } from "react-router-dom";
import allahSymbol from "@/assets/icon/allah-symbol.png";
import { useGetAllHadithQuery } from "../../slices/admin/hadith";
import { useGetAllBookListQuery } from "../../slices/utils";

export default function HadithReadPage() {
  const { number, id } = useParams();
  const { data: bookList } = useGetAllBookListQuery();
  const { data: response } = useGetAllHadithQuery();
  const hadiths = response?.data;
  console.log(hadiths);
  console.log(bookList);
  console.log(id);

  const selectedBookName = bookList?.data.find((book) => book.id === id);
  console.log(selectedBookName?.nameEn);
  const selectedHadiths = hadiths?.filter(
    (hadith) => hadith.bookName === selectedBookName?.nameEn
  );
  console.log(selectedHadiths);

  const selectedHadith = selectedHadiths
    ?.flatMap((hadith) =>
      hadith.parts.find((part) => part.partNumber === parseInt(number))
    )
    .find(Boolean);
  console.log("selectedHadith", selectedHadith);

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
      <div className="py-16 ">
        {/* heading */}
        <div className="container px-4 mx-auto  flex justify-between items-center text-xl py-5 md:text-3xl font-bold">
          <h1>{selectedHadith?.partName}</h1>
          <img src={allahSymbol} alt="allah symbol" />
          <p>{hadith.hadithArabic}</p>
        </div>

        {selectedHadith?.chapters?.map((chapter, index) => (
          <div key={index} className="my-10">
            <div className="bg-primary-foreground py-10">
              <div className="container px-4  mx-auto flex flex-col md:flex-row justify-between gap-5 text-xl text-white md:text-2xl font-medium">
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
            {/* hadith list */}
            {chapter.hadithList?.map((hadith, index) => (
              <div
                className="my-10 py-5 bg-primary-foreground px-2 md:px-0 text-xl text-white md:text-2xl font-medium"
                key={index}
              >
                <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between gap-5">
                  <div className="max-w-xl">
                    <h3 className="text-sm font-bold capitalize md:text-base mb-2">
                      Narrated by: {hadith.narrator}
                    </h3>
                    <h2 className="text-sm capitalize">
                      {hadith.hadithArabic}{" "}
                    </h2>
                  </div>
                  <h2 className="max-w-xl text-3xl">{hadith.hadithArabic} </h2>
                </div>
                <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between gap-5 mt-5">
                  <div className="text-xs md:text-sm">
                    <p>Rrference : <span className="text-primary">{hadith.referenceBook}</span></p>
                    <p>
                      In-book reference :{" "}
                      <span>Book {selectedHadith?.partNumber}</span>{" "}
                      <span>Hadith {hadith.hadithNumber}</span>
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs md:text-sm">
                    <p>Report Error |</p>
                    <p>Share</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
