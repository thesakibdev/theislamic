import { Button } from "@/components/ui/button";
import IndexPageBanner from "../../assets/index-page-banner.png";

import { useGetAllSurahsNameQuery } from "@/slices/admin/surah";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const navigate = useNavigate();
  const arabicSurahName = [
    { id: 1, name: "الفاتحة" },
    { id: 2, name: "البقرة" },
    { id: 3, name: "آل عمران" },
    { id: 4, name: "النساء" },
    { id: 5, name: "المائدة" },
    { id: 6, name: "الأنعام" },
    { id: 7, name: "الأعراف" },
    { id: 8, name: "الأنفال" },
    { id: 9, name: "التوبة" },
    { id: 10, name: "يونس" },
    { id: 11, name: "هود" },
    { id: 12, name: "يوسف" },
    { id: 13, name: "الرعد" },
    { id: 14, name: "إبراهيم" },
    { id: 15, name: "الحجر" },
    { id: 16, name: "النحل" },
    { id: 17, name: "الإسراء" },
    { id: 18, name: "الكهف" },
    { id: 19, name: "مريم" },
    { id: 20, name: "طه" },
    { id: 21, name: "الأنبياء" },
    { id: 22, name: "الحج" },
    { id: 23, name: "المؤمنون" },
    { id: 24, name: "النور" },
    { id: 25, name: "الفرقان" },
    { id: 26, name: "الشعراء" },
    { id: 27, name: "النمل" },
    { id: 28, name: "القصص" },
    { id: 29, name: "العنكبوت" },
    { id: 30, name: "الروم" },
    { id: 31, name: "لقمان" },
    { id: 32, name: "السجدة" },
    { id: 33, name: "الأحزاب" },
    { id: 34, name: "سبأ" },
    { id: 35, name: "فاطر" },
    { id: 36, name: "يس" },
    { id: 37, name: "الصافات" },
    { id: 38, name: "ص" },
    { id: 39, name: "الزمر" },
    { id: 40, name: "غافر" },
    { id: 41, name: "فصلت" },
    { id: 42, name: "الشورى" },
    { id: 43, name: "الزخرف" },
    { id: 44, name: "الدخان" },
    { id: 45, name: "الجاثية" },
    { id: 46, name: "الأحقاف" },
    { id: 47, name: "محمد" },
    { id: 48, name: "الفتح" },
    { id: 49, name: "الحجرات" },
    { id: 50, name: "ق" },
    { id: 51, name: "الذاريات" },
    { id: 52, name: "الطور" },
    { id: 53, name: "النجم" },
    { id: 54, name: "القمر" },
    { id: 55, name: "الرحمن" },
    { id: 56, name: "الواقعة" },
    { id: 57, name: "الحديد" },
    { id: 58, name: "المجادلة" },
    { id: 59, name: "الحشر" },
    { id: 60, name: "الممتحنة" },
    { id: 61, name: "الصف" },
    { id: 62, name: "الجمعة" },
    { id: 63, name: "المنافقون" },
    { id: 64, name: "التغابن" },
    { id: 65, name: "الطلاق" },
    { id: 66, name: "التحريم" },
    { id: 67, name: "الملك" },
    { id: 68, name: "القلم" },
    { id: 69, name: "الحاقة" },
    { id: 70, name: "المعارج" },
    { id: 71, name: "نوح" },
    { id: 72, name: "الجن" },
    { id: 73, name: "المزمل" },
    { id: 74, name: "المدثر" },
    { id: 75, name: "القيامة" },
    { id: 76, name: "الإنسان" },
    { id: 77, name: "المرسلات" },
    { id: 78, name: "النبأ" },
    { id: 79, name: "النازعات" },
    { id: 80, name: "عبس" },
    { id: 81, name: "التكوير" },
    { id: 82, name: "الإنفطار" },
    { id: 83, name: "المطففين" },
    { id: 84, name: "الإنشقاق" },
    { id: 85, name: "البروج" },
    { id: 86, name: "الطارق" },
    { id: 87, name: "الأعلى" },
    { id: 88, name: "الغاشية" },
    { id: 89, name: "الفجر" },
    { id: 90, name: "البلد" },
    { id: 91, name: "الشمس" },
    { id: 92, name: "الليل" },
    { id: 93, name: "الضحى" },
    { id: 94, name: "الشرح" },
    { id: 95, name: "التين" },
    { id: 96, name: "العلق" },
    { id: 97, name: "القدر" },
    { id: 98, name: "البينة" },
    { id: 99, name: "الزلزلة" },
    { id: 100, name: "العاديات" },
    { id: 101, name: "القارعة" },
    { id: 102, name: "التكاثر" },
    { id: 103, name: "العصر" },
    { id: 104, name: "الهمزة" },
    { id: 105, name: "الفيل" },
    { id: 106, name: "قريش" },
    { id: 107, name: "الماعون" },
    { id: 108, name: "الكوثر" },
    { id: 109, name: "الكافرون" },
    { id: 110, name: "النصر" },
    { id: 111, name: "المسد" },
    { id: 112, name: "الإخلاص" },
    { id: 113, name: "الفلق" },
    { id: 114, name: "الناس" },
  ];

  const { data: surahs, isLoading } = useGetAllSurahsNameQuery();

  return (
    <main>
      <section className="pt-[4.5rem] md:pt-40 pb-[50px]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10">
            <img src={IndexPageBanner} alt="banner" />
            <div className="">
              <h1 className="text-lg md:text-3xl font-bold text-black">
                The Eternal Light of Islam and the Sacred Heart of Kaaba
              </h1>
              <p className="text-black text-sm md:text-lg mt-[10px]">
                Islam, the religion of peace and submission to the One True God,
                shines as a beacon of guidance, unity, and compassion for
                humanity. At its core stands the Kaaba, the sacred house in
                Mecca, symbolizing the oneness of Allah and the direction of
                prayer for over a billion hearts. Wrapped in timeless reverence,
                the Kaaba is a testament to faith, devotion, and the unity of
                the Muslim Ummah—a sanctuary where every soul finds solace and a
                profound connection to the Divine.
                <p>update</p>
              </p>

              <Button className="text-white mt-5 md:mt-40 flex items-center md:py-4 py-2 px-4 md:px-8">
                Read More
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* surah list */}
      <section className="my-10 py-10 bg-[#f5f5f5]">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="recent" className="w-[400px] my-5">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                className="p-0 data-[state=active]:rounded-none"
                value="recent"
              >
                Recent Read
              </TabsTrigger>
              <TabsTrigger
                className="p-0 data-[state=active]:rounded-none"
                value="bookmark"
              >
                Bookmarks
              </TabsTrigger>
            </TabsList>
            <TabsContent value="recent">No Recent Read</TabsContent>
            <TabsContent value="bookmark">
              You do not have any bookmarks yet ?
            </TabsContent>
          </Tabs>
          <Tabs defaultValue="surah" className="w-full my-5">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                className="p-0 data-[state=active]:rounded-none"
                value="surah"
              >
                Surah
              </TabsTrigger>
              <TabsTrigger
                className="p-0 data-[state=active]:rounded-none"
                value="juz"
              >
                Juz
              </TabsTrigger>
            </TabsList>
            <TabsContent value="surah">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 justify-between gap-10">
                {surahs?.map((surah) => (
                  <div
                    className="flex justify-between items-center border cursor-pointer border-gray-200 p-5 rounded-lg hover:border-primary group"
                    key={surah.id}
                    onClick={() => navigate(`/recite/${surah.surahNumber}`)}
                  >
                    <div className="border rounded-sm bg-slate-400 group-hover:bg-primary text-white group-hover:text-wihite px-4 py-2  relative">
                      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">{surah.surahNumber}</p>
                    </div>
                    <div className="">
                      <div className="flex gap-5">
                        <p>{surah.surahName}</p>
                        <p>
                          {
                            arabicSurahName.find(
                              (name) => name.id === surah.surahNumber
                            )?.name
                          }
                        </p>
                      </div>

                      <div className="flex justify-end gap-5">
                        <p>Ayah: {surah.totalAyah}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="juz">
              You do not have any bookmarks yet ?
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
