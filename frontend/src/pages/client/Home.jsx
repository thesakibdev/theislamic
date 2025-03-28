import Banner from "../../assets/hero-banner.png";
// import SearchBar from "../../components/client/Search";
import { Input } from "@/components/ui/input";
import Search from "../../assets/icon/search-icon.png";

export default function Home() {
  return (
    <>
      {/* hero section  */}
      <section
        style={{ backgroundImage: `url(${Banner})` }}
        className="bg-no-repeat bg-cover bg-center flex justify-center items-center overflow-hidden min-h-screen"
      >
        <div className="container mx-auto px-4 ">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-white font-bold text-4xl text-center">
              This Website is Under Construction
            </h1>
            {/* <SearchBar className="mt-5 sm:mt-7 md:mt-10" /> */}
            <div className="mt-[70px] relative">
              <Input
                placeholder="What you want to know from Quran & Hadith?"
                className="w-full py-5 pl-16 rounded-full placeholder:text-xs md:placeholder:text-base"
              />
              <img
                src={Search}
                alt="search"
                className="absolute top-2 left-[20px]"
              />
            </div>
          </div>
        </div>
      </section>
      {/* <CounterUp /> */}
    </>
  );
}
