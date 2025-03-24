import { useNavigate } from "react-router-dom";
import RubAlHizb from "@/assets/icon/RubAlHizb";
import { booksList } from "../../../constant";

export default function HadithPage() {
  const navigate = useNavigate();

  return (
    <>
      <section className="bg-gray-200">
        <div className="container mx-auto py-16 px-4">
          <h1 className="text-xl px-3 md:text-2xl font-medium text-center text-black my-10">
            The Hadith Of the power muhammad At your Fingertips
          </h1>
          {/* hadith List */}
          <div className="grid md:grid-cols-2 justify-between gap-5 w-full">
            {booksList?.map((book, index) => (
              <div
                key={book._id}
                onClick={() => navigate(`/hadith/${book.id}`)}
                className="flex justify-between gap-5 items-center border cursor-pointer border-gray-200 bg-white/60 p-4 rounded-lg hover:border-primary group w-full"
              >
                <div className="flex gap-2 items-center">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute text-black text-sm font-medium group-hover:text-primary">
                      {index + 1}
                    </span>
                    <RubAlHizb
                      width={50}
                      height={50}
                      className="group-hover:text-primary text-black font-bold"
                    />
                  </div>
                  <div className="">
                    <p className="text-base md:text-xl text-black group-hover:text-primary">
                      {book?.nameEn}
                    </p>
                  </div>
                </div>

                <div dir="rtl" className="">
                  <p className="text-2xl text-black group-hover:text-primary text-right">
                    {book?.nameAr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
