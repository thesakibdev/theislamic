import Loading from "@/components/common/Loading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetAllSurahsNameQuery,
  useGetAllSurahsPaginatedQuery,
} from "@/slices/admin/surah";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Translation() {
  const { title } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { data: allSurahs } = useGetAllSurahsNameQuery();
  const {
    data: surahData,
    isLoading,
    isError,
  } = useGetAllSurahsPaginatedQuery({
    page: currentPage,
    limit: 1,
  });

  useEffect(() => {
    const foundSurah = surahData?.surahs?.find(
      (surah) => surah.surahName === decodeURI(title)
    );
    setCurrentPage(foundSurah?.surahNumber);
  }, []);

  const currentSurah = surahData?.surahs?.find(
    (surah) => surah.surahName == decodeURI(title)
  );
  console.log(currentSurah);
  if (isLoading) return <Loading />;
  if (isError) return <p>এরর হয়েছে!</p>;

  return (
    <>
      <section className="pt-16">
        <div className="container mx-auto">
          <div>
            <h2 className="text-4xl font-medium py-2 text-center">
              {currentSurah?.surahNumber} - {currentSurah?.surahName}
            </h2>
            {/* select the surah */}
            <div className="flex flex-col items-center gap-3 mt-4 justify-center">
              <span className="text-sm text-primary font-medium">
                The description of the surah
              </span>
              <Select
                onValueChange={(surah) => navigate(`/translation/${surah}`)}
              >
                <SelectTrigger className="max-w-[280px] focus:outline-none active:outline-none appearance-none">
                  <SelectValue placeholder="Select Surah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {allSurahs?.map((surah, i) => (
                      <SelectItem key={i} value={surah.surahName}>
                        {surah.surahNumber} - {surah.surahName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>{" "}
          {/* main */}
          <div className="mt-10 ">
            <Tabs defaultValue="arabic">
              <TabsList className="grid w-full grid-cols-3 gap-1 h-full max-w-[400px]">
                <TabsTrigger
                  value="arabic"
                  className="data-[state=active]:border rounded-t-lg data-[state=active]:border-b-0 py-2 border-primary bg-none data-[state=active]:rounded-b-none data-[state=active]:rounded-t-lg data-[state=active]:bg-transparent data-[state=active]:text-black"
                >
                  Arabic
                </TabsTrigger>
                <TabsTrigger
                  value="translation"
                  className="data-[state=active]:border rounded-t-lg data-[state=active]:border-b-0 py-2 border-primary bg-none data-[state=active]:rounded-b-none data-[state=active]:rounded-t-lg data-[state=active]:bg-transparent data-[state=active]:text-black"
                >
                  Translation
                </TabsTrigger>
                <TabsTrigger
                  value="language"
                  className="data-[state=active]:border rounded-t-lg data-[state=active]:border-b-0 py-2 border-primary bg-none data-[state=active]:rounded-b-none data-[state=active]:rounded-t-lg data-[state=active]:bg-transparent data-[state=active]:text-black"
                >
                  Language
                </TabsTrigger>
              </TabsList>
              <TabsContent
                className="mt-0 py-5 border border-primary data-[state=active]:rounded-b-lg data-[state=active]:rounded-r-lg"
                value="arabic"
              >
                <div className="mt-4 px-5 text-center">
                  <div
                    dir="rtl"
                    className="text-black w-full mx-auto leading-relaxed text-justify"
                  >
                    {Array.from({ length: 20 }).map((_, index) => (
                      <span
                        key={index}
                        className="text-2xl md:text-4xl font-arabic text-justify font-medium inline rtl:mr-0 align-middle ayah"
                      >
                        this is arabic ayahs
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent
                className="mt-0 py-5 border border-primary data-[state=active]:rounded-lg"
                value="translation"
              >
                <div className="mt-4">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={index}
                      className="px-5 border-b border-primary flex flex-col gap-5 py-7 md:py-10"
                    >
                      <div className="text-right text-3xl md:text-4xl rtl:mr-3">
                        <span className="">this is arabic ayah</span>
                        {/* <span className="relative w-[40px] h-[40px] inline-flex items-center justify-center align-middle ml-1">
                                    <VerseEndIcon
                                      width={35}
                                      height={35}
                                      className="align-middle"
                                    />
                                    <span className="absolute text-xs text-center align-middle">
                                      {convertToArabicNumber(verse.verseNumber)}
                                    </span>
                                  </span> */}
                      </div>

                      <p className="text-left text-base md:text-2xl w-[90%]">
                        this is translate ayah
                      </p>
                      {/* {Array.from({ length: 10 })
                                      key={i}
                                  .map((_, i) => (
                                  ))} */}
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent
                className="mt-0 py-5 border border-primary data-[state=active]:rounded-lg"
                value="language"
              >
                <div className="px-5">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={index}
                      className="border-b border-primary flex flex-col text-2xl gap-5 py-7 md:py-10"
                    >
                      {index + 1}. there is all Arabic translation ayah
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
}
