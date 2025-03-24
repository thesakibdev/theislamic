// src/components/Search.jsx
import { useState } from "react";
import { useSearchQuery } from "../../slices/utils";
import { booksList, surahNameList } from "../../constant";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";

const Search = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const navigate = useNavigate();

  // RTK Query hook (initially skipped until user searches)
  const { data, isLoading, isError, error } = useSearchQuery(
    { query: searchTerm, page, limit },
    { skip: !searchTerm }
  );

  const name = data?.results?.find((hadith) => hadith.bookName)?.bookName;
  const bookName = booksList?.find((book) => book.nameEn === name);
  const id = bookName?.id;
  const number = data?.results?.find((hadith) => hadith.bookName)?.parts
    ?.partNumber;

  console.log("surahNameList", surahNameList);
  console.log("data", data);

  const surahName = data?.results?.find((surah) => surah.name)?.name;
  console.log("surahName", surahName);
  const surahResult = surahNameList?.find(
    (surah) => surah.surahName.en === surahName
  );
  console.log("surahResult", surahResult);
  console.log("surahNumber", surahResult?.surahNumber);

  const handleSearch = (e) => {
    e.preventDefault();
    // ইউজার যখন সার্চ বাটন ক্লিক করবে তখন পেইজ ১ এ রিসেট করা
    setPage(1);
  };

  const handleNextPage = () => {
    if (data && data.total > page * limit) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // হাদিথ রেন্ডার করার ফাংশন
  const renderHadith = (hadith) => {
    return (
      <div className="hadith-container overflow-y-auto">
        <main
          className="border p-4 my-4 rounded-md border-primary cursor-pointer"
          onClick={() => navigate(`/hadith/${id}/${number}`)}
          key={hadith._id}
        >
          <h3 className="text-xl font-semibold">{hadith.bookName}</h3>
          <div className="hadith-content border-t border-primaryLight my-3 pt-3">
            <p>
              <strong>Part:</strong> {hadith.parts.partName} (
              {hadith.parts.partNumber})
            </p>
            <p>
              <strong>Chapter:</strong> {hadith.parts.chapters.chapterName} (
              {hadith.parts.chapters.chapterNumber})
            </p>
            <p>
              <strong>Hadith:</strong>{" "}
              {hadith.parts.chapters.hadithList.hadithNumber}
            </p>
            <p>
              <strong>Narrator:</strong>{" "}
              {hadith.parts.chapters.hadithList.narrator}
            </p>

            {hadith.parts.chapters.hadithList.hadithArabic && (
              <p className="arabic-text">
                {hadith.parts.chapters.hadithList.hadithArabic}
              </p>
            )}

            {hadith.parts.chapters.hadithList.translation && (
              <p>
                <strong>Translation:</strong>{" "}
                {hadith.parts.chapters.hadithList.translation}
              </p>
            )}

            {hadith.parts.chapters.hadithList.note && (
              <p>
                <strong>Note:</strong> {hadith.parts.chapters.hadithList.note}
              </p>
            )}
          </div>
        </main>
      </div>
    );
  };

  // সূরা রেন্ডার করার ফাংশন (আপনার সূরা ডাটা ফরম্যাট অনুযায়ী অ্যাডাপ্ট করুন)
  const renderSurah = (surah) => {
    return (
      <div
        key={surah._id}
        className="surah-card border p-4 my-4 rounded-md border-primary cursor-pointer"
        onClick={() => navigate(`/recite/${surah?.surahNumber}`)}
      >
        <h3 className="text-lg md:text-2xl font-bold">{surah.name}</h3>

        <div className="surah-content">
          <p className="text-sm md:text-xl font-serif">
            <span className="font-bold">Surah No:</span> {surah?.surahNumber}
          </p>
          <p className="text-sm md:text-xl font-serif">
            <span className="font-bold">Total Ayah:</span>{" "}
            {surahResult?.totalAyah}
          </p>
          <div className="flex gap-3 text-sm md:text-xl">
            <span className="font-bold">Juz No:</span>{" "}
            {surah?.juzNumber.map((juz, index) => (
              <p className="font-serif" key={index}>
                {juz}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={`${className} py-10`}>
      <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
        <div className="relative">
          <Input
            type="text"
            placeholder="What you want to know from Quran & Hadith?"
            className="w-full py-5 pl-6 rounded-full placeholder:text-xs md:placeholder:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute top-2 right-[20px] text-black hover:text-primary duration-300 transition-all ease-linear font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {isLoading && <div className="loading">Loading...</div>}

      {isError && <div className="error">Error: {error.message}</div>}

      {data && data.results && (
        <>
          <div className="search-results bg-white p-4 mt-2 overflow-y-auto rounded-md">
            {data.results.length === 0 ? (
              <p>No results found for {searchTerm}</p>
            ) : (
              <div className="results-list grid md:grid-cols-2 gap-5 overflow-y-scroll">
                {data.results.map((result) =>
                  result.bookName ? renderHadith(result) : renderSurah(result)
                )}
              </div>
            )}
          </div>

          {/*  next & prev button */}
          <div className="flex gap-3 mt-5 justify-center">
            <button
              onClick={handlePrevPage}
              disabled={page <= 1}
              className="cursor-pointer bg-white hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-black px-6 py-2 rounded-lg border border-black hover:border-primary disabled:opacity-50 border-black/50"
            >
              Prev
            </button>
            <button
              onClick={handleNextPage}
              disabled={data.total <= page * limit}
              className="cursor-pointer bg-white hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-black px-6 py-2 rounded-lg border border-black hover:border-primary disabled:opacity-50 border-black/50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Search;
