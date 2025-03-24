import Banner from "../../assets/hero-banner.png";
import SearchBar from "../../components/client/Search";

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
            <SearchBar className="mt-5 sm:mt-7 md:mt-10" />
          </div>
        </div>
      </section>
      {/* <CounterUp /> */}
    </>
  );
}
