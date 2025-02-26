import Loading from "@/components/common/Loading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  const [currentPage, setCurrentPage] = useState(null);
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

  // useEffect(() => {
  //   // setCurrentPage(
  //   //   Number(
  //   //     surahData?.surahs?.find((surah) => surah.surahName === decodeURI(title))
  //   //       ?.surahNumber
  //   //   )
  //   // );
  //   if (surahData) {
  //     const foundSurah = surahData?.surahs?.find(
  //       (surah) => surah.surahName === decodeURI(title)
  //     );
  //     if (foundSurah) {
  //       setCurrentPage(Number(foundSurah.surahNumber));
  //     }
  //   }
  // }, [title, surahData]);

  useEffect(() => {
    if (!surahData || isLoading) return; // যদি data লোড না হয়, তাহলে কিছু করো না

    const foundSurah = surahData.surahs?.find(
      (surah) => surah.surahName === decodeURI(title)
    );

    if (foundSurah) {
      setCurrentPage(Number(foundSurah.surahNumber));
    }
  }, [title, surahData, isLoading]); // ✅ `isLoading` অ্যাড করলাম

  console.log(
    surahData?.surahs?.find((surah) => surah.surahName === decodeURI(title)) ===
      decodeURI(title)
  );

  const currentSurah = surahData?.surahs?.find(
    (surah) => surah.surahName === decodeURI(title)
  );
  console.log(currentSurah);

  if (isLoading) return <Loading />;
  if (isError) return <p>এরর হয়েছে!</p>;

  return (
    <>
      <section className="pt-16">
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
        <div className="mt-10">
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
              <TabsTrigger value="tranlation">Tranlation</TabsTrigger>
              <TabsTrigger value="language">Language</TabsTrigger>
              <TabsTrigger value="arabic">Arabic</TabsTrigger>
            </TabsList>
            <TabsContent value="tranlation">tranlation </TabsContent>
            <TabsContent value="language">language </TabsContent>
            <TabsContent value="arabic">arabic </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
