// HadithDisplay.jsx
import React, { useState } from "react";
import { useGetHadithsQuery } from "../../slices/admin/hadith";

const HadithDisplay = () => {
  // State for pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Use RTK Query hook with pagination parameters
  const { data, error, isLoading, isFetching, refetch } = useGetHadithsQuery({
    page,
    limit,
  });

  // Extract data and pagination info
  const hadithData = data?.data || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.currentPage || page;

  // Handle page changes
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePageClick = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1); // Reset to first page when changing limit
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxDisplayedPages = 5;

    if (totalPages <= maxDisplayedPages) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate which pages to show
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxDisplayedPages / 2)
      );
      let endPage = startPage + maxDisplayedPages - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxDisplayedPages + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading hadiths...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mt-10">
        <p>Error loading hadith data: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!hadithData || hadithData.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded mt-10">
        <p>No hadiths found for this page</p>
        {page > 1 && (
          <button
            onClick={handlePreviousPage}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Previous Page
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-10 container mx-auto px-4">
      {/* Pagination Controls - Top */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <label htmlFor="limit-select">Show:</label>
          <select
            id="limit-select"
            value={limit}
            onChange={handleLimitChange}
            className="border rounded p-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>per page</span>
        </div>

        <div className="flex items-center">
          <span className="mr-2">
            Page {currentPage} of {totalPages} ({totalItems} total items)
          </span>
          <div className="flex space-x-1">
            <button
              onClick={handlePreviousPage}
              disabled={page <= 1}
              className={`px-3 py-1 rounded ${
                page <= 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700 text-white"
              }`}
            >
              &laquo;
            </button>

            {getPageNumbers().map((pageNum, index) => (
              <button
                key={index}
                onClick={() => pageNum !== "..." && handlePageClick(pageNum)}
                disabled={pageNum === "..."}
                className={`px-3 py-1 rounded ${
                  pageNum === "..."
                    ? "bg-gray-200"
                    : pageNum === currentPage
                    ? "bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-700 text-white"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className={`px-3 py-1 rounded ${
                page >= totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700 text-white"
              }`}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>

      {/* Loading indicator for page changes */}
      {isFetching && !isLoading && (
        <div className="bg-blue-50 text-blue-700 p-2 rounded mb-4 text-center">
          Loading new page...
        </div>
      )}

      {/* Hadith Display */}
      <div className="border border-gray-300 p-4">
        {hadithData.map((hadith, index) => (
          <div className="border border-gray-300 p-4 mb-4" key={index}>
            <h2 className="text-xl font-bold mb-2">Book: {hadith?.bookName}</h2>

            {hadith?.parts?.map((part, partIndex) => (
              <div
                key={partIndex}
                className="border-l-4 border-blue-500 pl-4 mb-4"
              >
                <h3 className="text-lg font-semibold">
                  Part {part?.partNumber}: {part?.partName}
                </h3>

                {part?.chapters?.map((chapter, chapterIndex) => (
                  <div
                    key={chapterIndex}
                    className="border-l-4 border-green-500 pl-4 mt-3 mb-4"
                  >
                    <h4 className="font-medium">
                      Chapter {chapter?.chapterNumber}: {chapter?.chapterName}
                    </h4>

                    {chapter?.hadithList?.length > 0 ? (
                      <div className="space-y-4 mt-2">
                        {chapter.hadithList.map((hadithItem, hadithIndex) => (
                          <div
                            key={hadithIndex}
                            className="border border-gray-300 p-4 rounded-lg bg-gray-50"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="col-span-2 md:col-span-1">
                                <p className="font-bold">
                                  #{hadithItem?.hadithNumber}
                                </p>
                                <p className="text-gray-600">
                                  International Number:{" "}
                                  {hadithItem?.internationalNumber || "N/A"}
                                </p>
                              </div>

                              <div className="col-span-2 md:col-span-1">
                                <p className="text-sm text-gray-600">
                                  Reference:{" "}
                                  {hadithItem?.referenceBook || "N/A"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Narrator: {hadithItem?.narrator || "N/A"}
                                </p>
                              </div>

                              {hadithItem?.hadithArabic && (
                                <div className="col-span-2 mt-2 mb-2 p-2 bg-blue-50 rounded rtl text-right">
                                  <p className="text-lg">
                                    {hadithItem.hadithArabic}
                                  </p>
                                </div>
                              )}

                              {hadithItem?.translation && (
                                <div className="col-span-2 mb-2">
                                  <p className="font-medium">Translation:</p>
                                  <p>{hadithItem.translation}</p>
                                </div>
                              )}

                              {hadithItem?.transliteration && (
                                <div className="col-span-2 mb-2">
                                  <p className="font-medium">
                                    Transliteration:
                                  </p>
                                  <p className="italic">
                                    {hadithItem.transliteration}
                                  </p>
                                </div>
                              )}

                              {hadithItem?.note && (
                                <div className="col-span-2 p-2 bg-yellow-50 rounded">
                                  <p className="font-medium">Note:</p>
                                  <p>{hadithItem.note}</p>
                                </div>
                              )}

                              {hadithItem?.similarities && (
                                <div className="col-span-2">
                                  <p className="font-medium">Similarities:</p>
                                  <p>{hadithItem.similarities}</p>
                                </div>
                              )}

                              {hadithItem?.hadithOtherLanguage?.length > 0 && (
                                <div className="col-span-2 mt-3 p-3 bg-gray-100 rounded">
                                  <p className="font-medium mb-2">
                                    Other Languages:
                                  </p>
                                  {hadithItem.hadithOtherLanguage.map(
                                    (lang, langIndex) => (
                                      <div
                                        key={langIndex}
                                        className="mb-2 p-2 bg-white rounded"
                                      >
                                        <p className="font-medium">
                                          {lang.language || "Unknown language"}
                                        </p>
                                        <p>
                                          {lang.hadithText ||
                                            "No translation available"}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic mt-2">
                        No hadiths found in this chapter
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Controls - Bottom */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={page <= 1}
          className={`px-4 py-2 rounded ${
            page <= 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700 text-white"
          }`}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded ${
            page >= totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HadithDisplay;
