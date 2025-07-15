import { useGetHadithsQuery } from "../../slices/admin/hadith";
import { Skeleton } from "@/components/ui/skeleton";

const HadithDisplay = ({ bookName, language, onHadithClick }) => {
  // Use RTK Query hook with pagination parameters
  const { data, error, isLoading, isFetching, refetch } = useGetHadithsQuery({
    bookName: bookName,
    language: language,
  });

  // Extract data and pagination info
  const hadithData = data?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
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

  // Flatten all hadiths into a single list for easier rendering
  const getAllHadiths = () => {
    const allHadiths = [];
    
    hadithData?.parts?.forEach((part) => {
      part?.chapters?.forEach((chapter) => {
        chapter?.hadithList?.forEach((hadith) => {
          allHadiths.push({
            ...hadith,
            partInfo: {
              partNumber: part.partNumber,
              partName: part.partName,
            },
            chapterInfo: {
              chapterNumber: chapter.chapterNumber,
              chapterName: chapter.chapterName,
            },
            bookName: hadithData.bookName,
          });
        });
      });
    });
    
    return allHadiths;
  };

  const hadiths = getAllHadiths();

  return (
    <div className="mt-4">
      {/* Loading indicator for page changes */}
      {isFetching && !isLoading && (
        <div className="bg-blue-50 text-blue-700 p-2 rounded mb-4 text-center">
          Loading new page...
        </div>
      )}

      {/* Hadith List */}
      {hadiths.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {hadiths.map((hadith, index) => (
            <div
              key={`${hadith.partInfo?.partNumber}-${hadith.chapterInfo?.chapterNumber}-${hadith.hadithNumber}-${index}`}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              onClick={() => onHadithClick && onHadithClick(hadith)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-lg font-semibold text-gray-900">
                    # Hadith No : {hadith.hadithNumber}
                  </div>
                  <div className="text-sm text-gray-600">
                    Part {hadith.partInfo?.partNumber}
                  </div>
                  <div className="text-sm text-gray-600">
                    Chapter {hadith.chapterInfo?.chapterNumber}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  {hadith.internationalNumber && `Int: ${hadith.internationalNumber}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No hadith found for the selected book and language. Add your first hadith below.
          </p>
        </div>
      )}
    </div>
  );
};

export default HadithDisplay;
