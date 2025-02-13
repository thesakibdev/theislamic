import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllSurahsPaginatedQuery } from "@/slices/admin/surah";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useParams } from "react-router-dom";
import Loading from "@/components/common/Loading";
import { useGetAllLanguagesQuery } from "@/slices/utils";

export default function RecitePage() {
  const { number } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { data: languages } = useGetAllLanguagesQuery();
  const [openSheet, setOpenSheet] = useState(false);

  useEffect(() => {
    setCurrentPage(Number(number));
  }, [number]);

  const {
    data: surahData,
    isLoading,
    isError,
  } = useGetAllSurahsPaginatedQuery({
    page: currentPage,
    limit: 1,
  });

  const currentSurah = surahData?.surahs?.find(
    (surah) => surah.surahNumber === Number(number)
  );
  console.log(currentSurah);

  if (isLoading) return <Loading />;
  if (isError) return <p>এরর হয়েছে!</p>;

  return (
    <>
      <section className="pt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            <div className="p-5 flex justify-center w-full">
              <Tabs defaultValue="reading" className="my-5">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 justify-start">
                  <TabsTrigger
                    className="p-0 data-[state=active]:rounded-full"
                    value="transliteration"
                  >
                    Transliteration
                  </TabsTrigger>
                  <TabsTrigger
                    className="p-0 data-[state=active]:rounded-full"
                    value="reading"
                  >
                    Reading
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="transliteration" className="w-full">
                  <div className="flex flex-col justify-center w-full">
                    <h2 className="text-2xl md:text-3xl text-center font-bold">
                      بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ
                    </h2>
                    <div className="mt-4 flex items-center flex-col">
                      {/* translation author */}
                      <div className="flex flex-col gap-1 my-2 items-start">
                        <h4 className="font-bold text-sm text-black">
                          Translation by
                        </h4>
                        <p className="text-base text-black font-normal">
                          Dr. Mustafa Khattab, The Clear Quran Translation
                          <button onClick={() => setOpenSheet(true)}>
                            Change
                          </button>
                        </p>
                      </div>

                      {isError ? (
                        <p>এরর হয়েছে!</p>
                      ) : isLoading ? (
                        <Loading />
                      ) : (
                        <div className="">
                          <div>
                            {currentSurah?.verses?.map((verse, index) => (
                              <div
                                key={index}
                                className="py-10 border-b border-primary"
                              >
                                <p className="text-right rtl:mr-3">{`${verse.arabicAyah} (${verse.verseNumber})`}</p>
                                {verse.verseOtherData
                                  ?.filter(
                                    (data) => data.language === selectedLanguage
                                  )
                                  .map((data) => (
                                    <p key={data._id} className="text-left">
                                      {data.translation}
                                    </p>
                                  ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reading">
                  <div className="flex flex-col text-center justify-center w-full px-4">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ
                    </h2>
                    {isError ? (
                      <p>এরর হয়েছে!</p>
                    ) : isLoading ? (
                      <Loading />
                    ) : (
                      <div className="mt-4 text-right">
                        <p className="text-4xl leading-normal rtl:mr-3 text-black break-words whitespace-normal tracking-wide font-amiri font-medium">
                          {currentSurah?.verses
                            ?.map(
                              (verse, index) =>
                                `${verse.arabicAyah} (${index + 1})`
                            )
                            .join(" ")}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <Sheet
            open={openSheet}
            onOpenChange={(isOpen) => setOpenSheet(isOpen)}
          >
            <SheetContent className="bg-primary">
              <SheetHeader>
                <SheetTitle>Translation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col ">
                {languages.data?.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      setOpenSheet(false);
                    }}
                    className={`px-4 py-2 m-2 ${
                      selectedLanguage === lang
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </section>
    </>
  );
}
