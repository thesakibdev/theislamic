import { Button } from "@/components/ui/button";
import IndexPageBanner from "../../assets/images/index-page-banner.png";
export default function IndexPage() {
  return (
    <main>
      <section className="pt-40 pb-[50px]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-[50px]">
            <img src={IndexPageBanner} alt="banner" />
            <div className="">
              <h1 className="text-xl md:text-3xl font-bold text-black">
                The Eternal Light of Islam and the Sacred Heart of Kaaba
              </h1>
              <p className="text-black mt-[10px]">
                Islam, the religion of peace and submission to the One True God,
                shines as a beacon of guidance, unity, and compassion for
                humanity. At its core stands the Kaaba, the sacred house in
                Mecca, symbolizing the oneness of Allah and the direction of
                prayer for over a billion hearts. Wrapped in timeless reverence,
                the Kaaba is a testament to faith, devotion, and the unity of
                the Muslim Ummah—a sanctuary where every soul finds solace and a
                profound connection to the Divine.
              </p>

              <Button className="text-primary mt-40 flex items-center py-4 px-8 rounded-none"></Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
