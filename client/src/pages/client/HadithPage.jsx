import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import {
  useGetAllBookListQuery,
  useGetAllLanguagesQuery,
} from "../../slices/utils";

export default function HadithPage() {
  const navigate = useNavigate();

  const { data: response } = useGetAllBookListQuery();
  const { data: allLanguages } = useGetAllLanguagesQuery();

  const allBookList = response?.data;

  return (
    <>
      <section>
        <div className="container mx-auto py-16">
          <h1 className="text-xl px-3 md:text-2xl font-medium text-center text-black my-10">
            The Hadith Of the power muhammad At your Fingertips
          </h1>
          <div className="flex justify-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="rounded-md border-2 focus:border-primary-foreground min-w-full md:w-96 px-5 py-1 text-xl outline-none shadow-inner "
              />
              <CiSearch className="absolute top-1/2 -translate-y-1/2 right-2 text-2xl" />
            </div>
          </div>
          {/* hadith List */}
          <div className="max-w-5xl mx-auto mt-10 py-8 bg-primary-foreground rounded-xl">
            {allBookList?.map((book) => (
              <div
                key={book._id}
                onClick={() => navigate(`/hadith/${book.id}`)}
                className="cursor-pointer flex justify-between items-center px-10 py-2 border-t-2 border-white"
              >
                <p className="text-2xl text-white">{book.nameEn}</p>
                <p className="text-xl text-white">{book.arabic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
