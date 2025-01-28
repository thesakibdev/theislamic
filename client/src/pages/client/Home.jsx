import { Input } from "@/components/ui/input";
import Banner from "../../assets/hero-banner.png";
import Search from "../../assets/icon/search-icon.png";

export default function Home() {
  return (
    <main>
      {/* hero section  */}
      <section
        style={{ backgroundImage: `url(${Banner})` }}
        className="h-screen bg-no-repeat bg-cover bg-center flex justify-center items-center"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-white font-bold text-4xl text-center">
            Explore a comprehensive collection of the Quran, Tafsir, and Hadith
            !
          </h1>
          <div className="mt-[70px] relative">
            <Input
              placeholder="what do you want to read?"
              className="w-full py-5 pl-16 rounded-full"
            />
            <img
              src={Search}
              alt="search"
              className="absolute top-2 left-[20px]"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
