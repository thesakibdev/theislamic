import { useNavigate, useParams } from "react-router-dom";
import { useGetAllHadithQuery } from "../../slices/admin/hadith";
import { useGetAllBookListQuery } from "../../slices/utils";

export default function HadithIndex() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const hadiths = Array.from({ length: 10 }, (_, index) => ({
  //   title: "Revelation",
  //   arabic: "كتاب بدء الوحي",
  //   hadithNo: 1,
  //   indexNo: index + 1,
  // }));

  const { data: bookList } = useGetAllBookListQuery();
  const { data: response } = useGetAllHadithQuery();
  const hadiths = response?.data;
  console.log(hadiths);
  console.log(bookList);
  console.log(id);

  const selectedBookName = bookList?.data.find((book) => book.id === id);
  console.log(selectedBookName?.nameEn);
  const selectedHadiths = hadiths?.filter(
    (hadith) => hadith.bookName === selectedBookName?.nameEn
  );
  console.log(selectedHadiths);

  return (
    <section>
      <div className="container mx-auto py-16 px-2">
        {/* hadith heading */}
        <div className="bg-primary-foreground flex flex-col gap-5 text-white font-serif py-5 md:py-10 px-5 md:px-16 rounded-xl my-10">
          <div className="flex justify-between">
            <h1 className="text-xl md:text-2xl font-bold">
              {selectedHadiths?.[0]?.bookName}
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

        {/* hadith list */}
        <div>
          <ul className="rounded-xl bg-white overflow-hidden">
            {selectedHadiths?.map((hadith, index) => (
              <li key={index}>
                {hadith.parts?.map((part, index) => (
                  <div
                    className="flex justify-between bg-primary-foreground text-xl md:text-2xl font-bold py-4 px-5 text-white border-b cursor-pointer"
                    key={index}
                    onClick={() => navigate(`/hadith/${id}/${part.partNumber}`)}
                  >
                    <p className="">{part.partName}</p>
                    <p className="">{part.partNumber}</p>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
