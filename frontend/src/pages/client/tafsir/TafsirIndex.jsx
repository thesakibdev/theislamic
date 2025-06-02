import React from "react";
import { surahNameList } from "../../../constant"
import { useNavigate } from "react-router-dom";

// const suraList = [
//   {
//     description: "সূচনা | The Opening",
//     type: "মাক্কী",
//   },
//   {
//     description: "বকনা-বাছুর | The Calf, The Cow",
//     type: "মাদানী",
//   },
//   {
//     description: "ইমরানের পরিবার | The Family of Imraan, The House of 'Imran",
//     type: "মাদানী",
//   },
// ];

export default function TafsirIndexPage() {
  const surah = surahNameList
  const navigate = useNavigate();

  return (
    <section className="pt-[4.5rem] md:pt-40 pb-10 bg-gray-200">
      <div className="container mx-auto px-4">
        <div
          className="bg-white rounded-lg shadow-md p-8"
        >
          <h2 className="text-center text-2xl font-bold mb-8">সূরা তালিকা</h2>
          {surah.map((sura) => (
            <div
              key={sura.surahNumber}
              className="border border-gray-200 rounded-lg mb-6 p-6 bg-gray-50 cursor-pointer hover:bg-gray-300 duration-300 transition-all group"
              onClick={() => {
                navigate(`/tafsir-list/${sura.surahNumber}`)
              }}
            >
              <div className="font-semibold text-xl text-blue-600 group-hover:text-primary duration-300 transition-all">
                {sura.surahNumber}. {sura.surahName.bn}{" "}
                {/* <span className="text-gray-600 font-normal">
                  | {sura.transliteration}
                </span>{" "} */}
                <span className="text-gray-800 font-serif text-2xl ml-2">
                  {sura.surahName.ar}
                </span>
              </div>
              {/* <div className="text-gray-600 mb-2">{sura.description}</div> */}
              <div className="text-sm text-gray-800">
                {/* <span className="mr-4">{sura.type}</span> */}
                <span>আয়াত সংখ্যা: {sura.totalAyah}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
