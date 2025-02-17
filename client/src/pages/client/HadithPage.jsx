import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export default function HadithPage() {
  const navigate = useNavigate();
  const hadith=[
    {
      hadithNo:1,
      title:"Sahih Al-Bukhari",
      arabic:"صحيح البخاري",
    },
    {
      hadithNo:2,
      title:"Sahih Muslim",
      arabic:"صحيح المسلم",
    },
    {
      hadithNo:3,
      title:"Sahih Tirmizi",
      arabic:"صحيح الترميزي",
    },
    {
      hadithNo:4,
      title:"Sahih Ibn Majah",
      arabic:"صحيح ابن ماجه",
    },
    {
      hadithNo:5,
      title:"Sahih al-Bukhari",
      arabic:"صحيح البخاري",
    },
    {
      hadithNo:6,
      title:"Sahih Muslim",
      arabic:"صحيح المسلم",
    },
    {
      hadithNo:7,
      title:"Sahih Tirmizi",
      arabic:"صحيح الترميزي",
    },
    {
      hadithNo:8,
      title:"Sahih Ibn Majah",
      arabic:"صحيح ابن ماجه",
    },
    {
      hadithNo:9,
      title:"Sahih al-Bukhari",
      arabic:"صحيح البخاري",
    },
    {
      hadithNo:10,
      title:"Sahih Muslim",
      arabic:"صحيح المسلم",
    },
    {
      hadithNo:11,
      title:"Sahih Tirmizi",
      arabic:"صحيح الترميزي",
    },
    {
      hadithNo:12,
      title:"Sahih Ibn Majah",
      arabic:"صحيح ابن ماجه",
    },
  ]
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
            {hadith.map((hadith) => (
              <div
                key={hadith.hadithNo}
                onClick={() => navigate(`/hadith/${hadith.title}`)}
                className="cursor-pointer flex justify-between items-center px-10 py-2 border-t-2 border-white"
              >
                <p className="text-2xl text-white">{hadith.title}</p>
                <p className="text-xl text-white">{hadith.arabic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
