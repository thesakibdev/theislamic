import { useNavigate, useParams } from "react-router-dom";
import { useGetHadithsQuery } from "../../../slices/admin/hadith";
import { booksList } from "../../../constant";

export default function HadithIndex() {
  const { id } = useParams();
  const navigate = useNavigate();

  const bookName = booksList?.find((book) => book.id === id);

  const { data, error, isLoading, refetch } = useGetHadithsQuery({
    bookName: bookName?.nameEn,
    language: "en",
  });

  const selectedBook = data?.data || [];


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-0">
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2">Loading hadiths...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-0">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mt-10">
          <p>Error loading hadith data: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="container mx-auto py-16 px-2">
        {/* hadith heading */}
        <div className="bg-primary-foreground flex flex-col gap-5 text-white font-serif py-5 md:py-10 px-5 md:px-16 rounded-xl my-10">
          <div className="flex justify-between">
            <h1 className="text-xl md:text-2xl font-bold">
              {selectedBook?.bookName || "No Book Selected"}
            </h1>
            <p className="text-xl md:text-2xl font-bold">صحيح البخاري</p>
          </div>
          <p className="text-sm md:text-lg">
            Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad
            al-Bukhari (d. 256 AH/870 AD) (rahimahullah). His collection is
            recognized by the overwhelming majority of the Muslim world to be
            the most authentic collection of reports of the Sunnah of the
            Prophet Muhammad (ﷺ). It contains over 7500 hadith (with
            repetitions) in 97 books. The translation provided here is by Dr. M.
            Muhsin Khan.
          </p>
          <button className="text-right text-lg">More Information...</button>
        </div>

        {/* hadith list - only render if selectedBook is defined */}
        <div>
          <ul className="rounded-xl bg-white overflow-hidden">
            {selectedBook?.parts && selectedBook.parts.length > 0 ? (
              selectedBook.parts.map((part, index) => (
                <div
                  className="flex justify-between bg-primary-foreground text-xl md:text-2xl font-bold py-4 px-5 text-white border-b cursor-pointer"
                  key={index}
                  onClick={() =>
                    part?.partNumber &&
                    navigate(`/hadith/${id}/${part.partNumber}`)
                  }
                >
                  <p className="">{part?.partName || "Unknown Part"}</p>
                  <p className="">{part?.partNumber || "Unknown Number"}</p>
                </div>
              ))
            ) : (
              <li className="p-5 font-bold text-xl md:text-2xl">
                {bookName
                  ? `No parts found for ${bookName}`
                  : "No book selected or book not found. Please check the URL or select another book."}
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
