import { useNavigate, useParams } from "react-router-dom";
import { useGetAllHadithQuery } from "../../../slices/admin/hadith";
import { useGetAllBookListQuery } from "../../../slices/utils";

export default function HadithIndex() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: bookList, isLoading } = useGetAllBookListQuery();
  const { data: response, isLoading: responseLoading } = useGetAllHadithQuery();

  // Show loading state if either query is loading
  if (isLoading || responseLoading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  // Early return if data isn't available
  if (!bookList || !response) {
    return <div className="text-center text-lg">Fetching data...</div>;
  }

  // Safely handle data with fallbacks
  const books = response?.data || [];
  
  // Make sure to handle the case when bookList.data is undefined
  const selectedBookName = bookList?.data?.find((book) => book?.id === id) || {};
  
  // Log for debugging
  // console.log("ID:", id);
  // console.log("Selected Book Name:", selectedBookName?.nameEn || "Book not found");
  // console.log("Books Length:", books?.length || 0);

  // Safely find the book with a fallback
  const selectedBook = books?.find(
    (book) => book?.bookName === selectedBookName?.nameEn
  ) || { bookName: "No Book Selected", parts: [] }; // Provide a default object

  // Log selected book for debugging
  // console.log("Selected Book:", selectedBook?.bookName || "No book selected");

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
                  onClick={() => part?.partNumber && navigate(`/hadith/${id}/${part.partNumber}`)}
                >
                  <p className="">{part?.partName || "Unknown Part"}</p>
                  <p className="">{part?.partNumber || "Unknown Number"}</p>
                </div>
              ))
            ) : (
              <li className="p-5 font-bold text-xl md:text-2xl">
                {selectedBookName?.nameEn 
                  ? `No parts found for ${selectedBookName.nameEn}` 
                  : "No book selected or book not found. Please check the URL or select another book."}
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}