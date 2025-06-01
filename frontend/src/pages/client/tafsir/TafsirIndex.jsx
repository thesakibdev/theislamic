import React from "react";

const suraList = [
  {
    number: 1,
    name: "আল-ফাতিহা",
    transliteration: "Al-Fatiha",
    arabic: "الفاتحة",
    description: "সূচনা | The Opening",
    type: "মাক্কী",
    ayatCount: 7,
  },
  {
    number: 2,
    name: "আল-বাকারা",
    transliteration: "Al-Baqara",
    arabic: "البقرة",
    description: "বকনা-বাছুর | The Calf, The Cow",
    type: "মাদানী",
    ayatCount: 286,
  },
  {
    number: 3,
    name: "আলে-ইমরান",
    transliteration: "Al-i-Imran",
    arabic: "آل عمران",
    description: "ইমরানের পরিবার | The Family of Imraan, The House of 'Imran",
    type: "মাদানী",
    ayatCount: 200,
  },
];

export default function TafsirIndexPage() {
  return (
    <section className="pt-[4.5rem] md:pt-40 pb-10 bg-gray-200">
      <div className="container mx-auto px-4">
        <div
          className="bg-white rounded-lg shadow-md p-8"
        >
          <h2 className="text-center text-2xl font-bold mb-8">সূরা তালিকা</h2>
          {suraList.map((sura) => (
            <div
              key={sura.number}
              className="border border-gray-200 rounded-lg mb-6 p-6 bg-gray-50"
            >
              <div className="font-semibold text-xl text-blue-600">
                {sura.number}. {sura.name}{" "}
                <span className="text-gray-600 font-normal">
                  | {sura.transliteration}
                </span>{" "}
                <span className="text-gray-800 font-serif text-2xl ml-2">
                  {sura.arabic}
                </span>
              </div>
              <div className="text-gray-600 mb-2">{sura.description}</div>
              <div className="text-sm text-gray-800">
                <span className="mr-4">{sura.type}</span>
                <span>আয়াত সংখ্যা: {sura.ayatCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
