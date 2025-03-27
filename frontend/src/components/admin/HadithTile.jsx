import { useGetHadithsQuery } from "../../slices/admin/hadith";

const HadithDisplay = ({ bookName, language }) => {
  // Use RTK Query hook with pagination parameters
  const { data, error, isLoading, isFetching, refetch } = useGetHadithsQuery({
    bookName: bookName,
    language: language,
  });

  // Extract data and pagination info
  const hadithData = data?.data || [];

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

  return (
    <div className="mt-10 container mx-auto px-4 sm:px-0">
      {/* Loading indicator for page changes */}
      {isFetching && !isLoading && (
        <div className="bg-blue-50 text-blue-700 p-2 rounded mb-4 text-center">
          Loading new page...
        </div>
      )}

      {/* Hadith Display */}
      <div className="border border-gray-300 p-4">
        <div className="border border-gray-300 p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">
            Book: {hadithData?.bookName}
          </h2>
          {hadithData?.parts?.map((part, partIndex) => (
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
                                Reference: {hadithItem?.referenceBook || "N/A"}
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
                            {hadithItem?.hadithText && (
                              <div className="col-span-2 mt-2 mb-2 p-2 bg-blue-50 rounded text-left">
                                <span className="font-semibold text-base uppercase">
                                  {language}:
                                </span>
                                <p className="text-lg">
                                  {hadithItem.hadithText}
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
                                <p className="font-medium">Transliteration:</p>
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
      </div>
    </div>
  );
};

export default HadithDisplay;
