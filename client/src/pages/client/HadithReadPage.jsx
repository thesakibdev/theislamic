import { useParams } from "react-router-dom";
import allahSymbol from "@/assets/icon/allah-symbol.png";

export default function HadithReadPage() {
  const { number } = useParams();
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
        <div className="container mx-auto  flex justify-between items-center text-xl py-5 md:text-3xl font-bold">
          <h1>{hadith.title}</h1>
          <img src={allahSymbol} alt="allah symbol" />
          <p>{hadith.hadithArabic}</p>
        </div>
        {/* hadith chapter */}
        <div className="py-10 my-10 bg-primary-foreground px-2 md:px-0">
          <div className="container mx-auto flex flex-col md:flex-row justify-between gap-5 text-xl text-white md:text-2xl font-medium">
            <h1 className="max-w-xl">{hadith.hadithChapter} <span className="text-primary font-bold">Chapter no. {number} </span> </h1>
            <h1 className="max-w-xl text-3xl">{hadith.hadithChapterArabic} </h1>
          </div>
        </div>
        {/* hadith para */}
        <div className="py-10 bg-primary-foreground px-2 md:px-0">
          <div className="container mx-auto text-xl text-white md:text-2xl font-medium">
            <h1 className="text-center">{`وَقَوْلُ اللَّهِ جَلَّ ذِكْرُهُ: {إِنَّا أَوْحَيْنَا إِلَيْكَ كَمَا أَوْحَيْنَا إِلَى نُوحٍ وَالنَّبِيِّينَ مِنْ بَعْدِهِ}`}</h1>
            <div className="flex flex-col md:flex-row gap-5 justify-between mt-14">
              <h2 className="max-w-xl">{hadith.hadithPara1} </h2>
              <h2 className="max-w-xl text-3xl">{hadith.hadithPara1Arabic} </h2>
            </div>
          </div>
        </div>
        {/* hadith para */}
        <div className="my-10 py-10 bg-primary-foreground px-2 md:px-0 text-xl text-white md:text-2xl font-medium">
          <div className="container mx-auto flex flex-col md:flex-row gap-5 justify-between mt-14">
            <h2 className="max-w-xl">{hadith.hadithPara1} </h2>
            <h2 className="max-w-xl text-3xl">{hadith.hadithPara1Arabic} </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
