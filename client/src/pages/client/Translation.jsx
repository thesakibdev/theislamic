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
  const [currentPage, setCurrentPage] = useState(null);
  const navigate = useNavigate();
  const { data: allSurahs } = useGetAllSurahsNameQuery();
  const {
    data: surahData,
    isLoading,
    isError,
  } = useGetAllSurahsPaginatedQuery(
    {
      page: 1,
      currentPage: currentPage,
    }
  );

  useEffect(() => {
    if (!surahData || isLoading) return; // যদি data লোড না হয়, তাহলে কিছু করো না

    const foundSurah = surahData.surahs?.find(
      (surah) => surah.surahName === title
    );

    if (foundSurah) {
      setCurrentPage(Number(foundSurah.surahNumber));
    }
    console.log(foundSurah);
  }, [title, surahData, isLoading]); // ✅ `isLoading` অ্যাড করলাম

  // console.log(
  //   surahData?.surahs?.find((surah) => surah.surahName === decodeURI(title)) ===
  //     decodeURI(title)
  // );

  const currentSurah = surahData?.surahs?.find(
    (surah) => surah.surahName === decodeURI(title)
  );
  // console.log(currentSurah);
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
                  value="tranlation"
                  className="data-[state=active]:border rounded-t-lg data-[state=active]:border-b-0 py-2 border-primary bg-none data-[state=active]:rounded-b-none data-[state=active]:rounded-t-lg data-[state=active]:bg-transparent data-[state=active]:text-black"
                >
                  Tranlation
                </TabsTrigger>
                <TabsTrigger
                  value="language"
                  className="data-[state=active]:border rounded-t-lg data-[state=active]:border-b-0 py-2 border-primary bg-none data-[state=active]:rounded-b-none data-[state=active]:rounded-t-lg data-[state=active]:bg-transparent data-[state=active]:text-black"
                >
                  Language
                </TabsTrigger>
                <TabsTrigger
                  value="arabic"
                  className="data-[state=active]:border rounded-t-lg data-[state=active]:border-b-0 py-2 border-primary bg-none data-[state=active]:rounded-b-none data-[state=active]:rounded-t-lg data-[state=active]:bg-transparent data-[state=active]:text-black"
                >
                  Arabic
                </TabsTrigger>
              </TabsList>
              <TabsContent
                className="mt-0 py-5 px-2 border border-primary data-[state=active]:rounded-b-lg data-[state=active]:rounded-r-lg"
                value="tranlation"
              >
                tranlation{" "}
              </TabsContent>
              <TabsContent
                className="mt-0 py-5 px-2 border border-primary data-[state=active]:rounded-lg"
                value="language"
              >
                language{" "}
              </TabsContent>
              <TabsContent
                className="mt-0 py-5 px-2 border border-primary data-[state=active]:rounded-lg"
                value="arabic"
              >
                arabic{" "}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
}
