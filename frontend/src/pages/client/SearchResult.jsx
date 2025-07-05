// src/components/Search.jsx
import { useState } from "react";
import { useSearchQuery } from "../../slices/utils";
import { booksList, surahNameList } from "../../constant";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BookOpen, FileText, Book, BookOpen as TafsirIcon, Filter, X } from "lucide-react";

const SearchResult = ({ className }) => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("query");

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "",
    language: searchParams.get("language") || "",
    surahNumber: searchParams.get("surahNumber") || ""
  });
  const limit = 50;

  const navigate = useNavigate();

  // RTK Query hook (initially skipped until user searches)
  const { data, isLoading, isError, error } = useSearchQuery(
    { 
      query: searchTerm, 
      page, 
      limit,
      ...filters
    },
    { skip: !searchTerm }
  );

  const handleNextPage = () => {
    if (data && data.pagination && data.pagination.hasNextPage) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
    
    // Update URL with new filters
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(filterType, value);
    } else {
      params.delete(filterType);
    }
    navigate(`/search-results?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({ type: "", language: "", surahNumber: "" });
    setPage(1);
    navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
  };

  // Get icon for result type
  const getResultIcon = (type) => {
    switch (type) {
      case 'surah':
        return <Book className="w-5 h-5 text-green-600" />;
      case 'hadith':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'verseOther':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'tafsir':
        return <TafsirIcon className="w-5 h-5 text-orange-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  // Get type label
  const getTypeLabel = (type) => {
    switch (type) {
      case 'surah':
        return 'Surah';
      case 'hadith':
        return 'Hadith';
      case 'verseOther':
        return 'Verse';
      case 'tafsir':
        return 'Tafsir';
      default:
        return 'Other';
    }
  };

  // Render Hadith result
  const renderHadith = (hadith) => {
    return (
      <div
        key={hadith._id}
        className="border p-6 my-4 rounded-lg border-gray-200 hover:border-blue-300 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
        onClick={() => navigate(`/hadith/${hadith.bookName}/${hadith.partNumber}`)}
      >
        <div className="flex items-start gap-3 mb-4">
          {getResultIcon('hadith')}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{hadith.bookName}</h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getTypeLabel('hadith')}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Part:</strong> {hadith.partNumber}</p>
              <p><strong>Chapter:</strong> {hadith.chapterNumber}</p>
              <p><strong>Hadith:</strong> {hadith.hadithNumber}</p>
              {hadith.narrator && (
                <p><strong>Narrator:</strong> {hadith.narrator}</p>
              )}
              <p><strong>Language:</strong> {hadith.language}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          {hadith.arabicAyah && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1"><strong>Arabic:</strong></p>
              <p className="arabic-text text-lg leading-relaxed">
                {hadith.arabicAyah}
              </p>
            </div>
          )}

          {hadith.translation && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1"><strong>Translation:</strong></p>
              <p className="text-gray-800 leading-relaxed">
                {hadith.translation}
              </p>
            </div>
          )}

          {hadith.note && (
            <div>
              <p className="text-sm text-gray-600 mb-1"><strong>Note:</strong></p>
              <p className="text-gray-700 text-sm">
                {hadith.note}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Surah result
  const renderSurah = (surah) => {
    return (
      <div
        key={surah._id}
        className="border p-6 my-4 rounded-lg border-gray-200 hover:border-green-300 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
        onClick={() => navigate(`/recite/${surah.surahNumber}`)}
      >
        <div className="flex items-start gap-3 mb-4">
          {getResultIcon('surah')}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{surah.surahName}</h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {getTypeLabel('surah')}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Surah Number:</strong> {surah.surahNumber}</p>
              <p><strong>Verse Number:</strong> {surah.verseNumber}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          {surah.arabicAyah && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1"><strong>Arabic:</strong></p>
              <p className="arabic-text text-lg leading-relaxed">
                {surah.arabicAyah}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render VerseOther result
  const renderVerseOther = (verse) => {
    return (
      <div
        key={verse._id}
        className="border p-6 my-4 rounded-lg border-gray-200 hover:border-purple-300 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
        onClick={() => navigate(`/recite/${verse.surahNumber}?verse=${verse.verseNumber}`)}
      >
        <div className="flex items-start gap-3 mb-4">
          {getResultIcon('verseOther')}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Surah {verse.surahNumber}, Verse {verse.verseNumber}
              </h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {getTypeLabel('verseOther')}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              <p><strong>Language:</strong> {verse.language}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          {verse.translation && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1"><strong>Translation:</strong></p>
              <p className="text-gray-800 leading-relaxed">
                {verse.translation}
              </p>
            </div>
          )}

          {verse.transliteration && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1"><strong>Transliteration:</strong></p>
              <p className="text-gray-700 italic">
                {verse.transliteration}
              </p>
            </div>
          )}

          {verse.note && (
            <div>
              <p className="text-sm text-gray-600 mb-1"><strong>Note:</strong></p>
              <p className="text-gray-700 text-sm">
                {verse.note}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Tafsir result
  const renderTafsir = (tafsir) => {
    return (
      <div
        key={tafsir._id}
        className="border p-6 my-4 rounded-lg border-gray-200 hover:border-orange-300 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
        onClick={() => navigate(`/tafsir/${tafsir.surahNumber}`)}
      >
        <div className="flex items-start gap-3 mb-4">
          {getResultIcon('tafsir')}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {tafsir.surahName} - {tafsir.bookName || 'Tafsir'}
              </h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {getTypeLabel('tafsir')}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Surah Number:</strong> {tafsir.surahNumber}</p>
              <p><strong>Language:</strong> {tafsir.language}</p>
              <p><strong>Verse Number:</strong> {tafsir.verseNumber}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          {tafsir.arabicAyah && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1"><strong>Arabic Ayah:</strong></p>
              <p className="arabic-text text-lg leading-relaxed">
                {tafsir.arabicAyah}
              </p>
            </div>
          )}

          {tafsir.content && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1"><strong>Content:</strong></p>
              <p className="text-gray-800 leading-relaxed">
                {tafsir.content}
              </p>
            </div>
          )}

          {tafsir.note && (
            <div>
              <p className="text-sm text-gray-600 mb-1"><strong>Note:</strong></p>
              <p className="text-gray-700 text-sm">
                {tafsir.note}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render result based on type
  const renderResult = (result) => {
    switch (result.type) {
      case 'surah':
        return renderSurah(result);
      case 'hadith':
        return renderHadith(result);
      case 'verseOther':
        return renderVerseOther(result);
      case 'tafsir':
        return renderTafsir(result);
      default:
        return renderHadith(result);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <section className={`${className} pt-[4.5rem]`}>
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Searching...</span>
        </div>
      )}

      {isError && (
        <div className="text-center py-12">
          <div className="text-red-600 mb-2">Error occurred while searching</div>
          <div className="text-sm text-gray-600">{error?.message}</div>
        </div>
      )}

      {data && (
        <>
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Search Results for "{searchTerm}"
              </h1>
              <p className="text-gray-600">
                Found {data.resultCounts?.total || 0} results
                {data.pagination && (
                  <span> (Page {data.pagination.currentPage} of {data.pagination.totalPages})</span>
                )}
              </p>
            </div>

            {/* Filters Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="hadith">Hadith</option>
                    <option value="tafsir">Tafsir</option>
                    <option value="verseOther">Verse</option>
                    <option value="surah">Surah</option>
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={filters.language}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Languages</option>
                    <option value="english">English</option>
                    <option value="bengali">Bengali</option>
                    <option value="arabic">Arabic</option>
                  </select>
                </div>

                {/* Surah Number Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Surah Number</label>
                  <input
                    type="number"
                    value={filters.surahNumber}
                    onChange={(e) => handleFilterChange('surahNumber', e.target.value)}
                    placeholder="Enter surah number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Result Counts */}
            {data.resultCounts && (
              <div className="mb-6 flex flex-wrap gap-4">
                {Object.entries(data.resultCounts).map(([type, count]) => {
                  if (type === 'total' || count === 0) return null;
                  return (
                    <div key={type} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                      {getResultIcon(type)}
                      <span className="text-sm font-medium text-gray-700">
                        {getTypeLabel(type)}: {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Results */}
            {data.results && (
              <div className="search-results bg-white rounded-lg">
                {Object.entries(data.results).map(([type, results]) => {
                  if (!results || results.length === 0) return null;
                  
                  return (
                    <div key={type} className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        {getResultIcon(type)}
                        {getTypeLabel(type)} ({results.length})
                      </h2>
                      <div className="results-list space-y-4">
                        {results.map((result) => renderResult(result))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {(!data.results || Object.values(data.results).every(results => !results || results.length === 0)) && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No results found</div>
                <div className="text-gray-400">Try different keywords or check your spelling</div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {data.pagination && data.pagination.totalPages > 1 && (
            <div className="flex gap-3 mt-8 justify-center">
              <button
                onClick={handlePrevPage}
                disabled={!data.pagination.hasPrevPage}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-6 py-2 text-gray-600">
                Page {data.pagination.currentPage} of {data.pagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!data.pagination.hasNextPage}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default SearchResult;
