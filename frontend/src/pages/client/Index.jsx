import { Button } from "@/components/ui/button";
import IndexPageBanner from "../../assets/index-page-banner.png";
import { surahNameList } from "../../constant";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useNavigate } from "react-router-dom";
import RubAlHizb from "@/assets/icon/RubAlHizb";

export default function IndexPage() {
  const navigate = useNavigate();

  let recentSurahs = JSON.parse(localStorage.getItem("surahs")) || [];

  return (
    <main className="bg-gray-200 pt-[4.5rem] pb-10 md:py-30">
      <section className=" pb-[5px]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col xl:flex-row items-center gap-5 md:gap-10">
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
              <Button className="text-white mt-5 lx:mt-40 flex items-center md:py-4 py-2 px-4 md:px-8">
                Read More
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* surah list */}
      <section className="mt-10 pt-10">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="recent" className="my-5">
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
            <TabsContent value="recent">
              {recentSurahs.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto whitespace-nowrap">
                  {recentSurahs.map((surah) => (
                    <p
                      key={surah.surahNumber}
                      className="text-md font-bold cursor-pointer hover:text-primary-foreground"
                      onClick={() => navigate(`/recite/${surah.surahNumber}`)}
                    >
                      {surah.surahName},
                    </p>
                  ))}
                </div>
              ) : null}
            </TabsContent>

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
            <TabsContent value="surah" className="w-full">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-between gap-10 w-full">
                {surahNameList?.map((surah) => (
                  <div
                    className="flex justify-between items-center border cursor-pointer p-5 rounded-lg hover:border-primary group w-full bg-white"
                    key={surah.id}
                    onClick={() => {
                      navigate(`/recite/${surah.surahNumber}`);
                      // Age store kora data ber kore
                      let storedSurahs =
                        JSON.parse(localStorage.getItem("surahs")) || [];

                      // Check kore dekhbo jeno duplicate na thake
                      if (
                        !storedSurahs.some(
                          (s) => s.surahNumber === surah.surahNumber
                        )
                      ) {
                        storedSurahs.push({
                          surahNumber: surah.surahNumber,
                          surahName: surah.surahName,
                        });
                      }

                      // Update localStorage
                      localStorage.setItem(
                        "surahs",
                        JSON.stringify(storedSurahs)
                      );
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      <div className="relative flex items-center justify-center mr-5">
                        <span className="absolute text-black text-sm font-medium group-hover:text-primary">
                          {surah.surahNumber}
                        </span>
                        <RubAlHizb
                          width={71}
                          height={71}
                          className="group-hover:text-primary text-black font-bold"
                        />
                      </div>
                      {/* en name */}
                      <div className="">
                        <p className="font-bold text-lg lg:text-xl font-sans text-start">
                          {surah.surahName.en}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="">
                        {/* ar name */}
                        <div
                          className="text-right font-arabic text-balck text-lg rlt lg:text-2xl font-bold group-hover:text-primary"
                          dir="rtl"
                        >
                          {surah.surahName.ar}
                        </div>
                        <p className="font-bold text-sm text-primary-foreground group-hover:text-primary">
                          Ayah: {surah.totalAyah}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="juz" className="w-full">
              Juz coming soon!
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
