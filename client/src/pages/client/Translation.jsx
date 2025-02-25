import Loading from "@/components/common/Loading";
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
  const {
    data: surahData,
    isLoading,
    isError,
  } = useGetAllSurahsPaginatedQuery({
    page: currentPage,
    limit: 1,
  });
  const { data: allSurahs } = useGetAllSurahsNameQuery();

  useEffect(() => {
    setCurrentPage(Number(surahData?.surahs?.find((surah) => surah.surahName === decodeURI(title))?.surahNumber));
  }, [title]);

  const currentSurah = surahData?.surahs?.find(
    (surah) => surah.surahName === decodeURI(title)
  );
  console.log(
    surahData?.surahs?.find((surah) => surah.surahName === decodeURI(title))?.surahNumber
  );
  console.log(currentSurah);

  if (isLoading) return <Loading />;
  if (isError) return <p>এরর হয়েছে!</p>;

  return (
    <>
      <section className="pt-16">
        <h2 className="text-4xl font-medium py-2 text-center">
          {currentSurah?.surahNumber} - {currentSurah?.surahName}
        </h2>
        {/* select the surah */}
        <div className="flex flex-col items-center gap-3 mt-4 justify-center">
          <span className="text-sm text-primary-foreground">
            The description of the surah
          </span>
          <select
            name="surah"
            id="surah"
            className="py-2 px-5 text-lg border-primary border-2 focus:outline-none focus:bg-primary-foreground/5 rounded-md appearance-none"
            onChange={(e) => navigate(`/translation/${e.target.value}`)}
          >
            <option selected disabled>
              Select Surah
            </option>
            {allSurahs?.map((surah, i) => (
              <option key={i} value={surah.surahName}>
                {surah.surahNumber} - {surah.surahName}
              </option>
            ))}
          </select>
        </div>
      </section>
    </>
  );
}
