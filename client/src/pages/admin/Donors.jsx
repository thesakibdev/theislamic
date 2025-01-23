import { RiDeleteBinLine } from "react-icons/ri";

export default function Donors() {
  const allDonors = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=srgb&fm=jpg&ixid=M3w2NjMyNTh8MHwxfHNlYXJjaHwxfHxjb21wYW55fGVufDB8fHx8MTczNzI5NDYwNHww&ixlib=rb-4.0.3&q=85",
      title: {
        name: "Donor 1",
        role: "Seo of ABC Company",
      },
      country: "Country 1",
      city: "City 1",
      quranAyatArabic: "Quran Ayat Arabic 1",
      quranAyatEnglish: "Quran Ayat English 1",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w2NjMyNTh8MHwxfHNlYXJjaHwzfHxjb21wYW55fGVufDB8fHx8MTczNzI5NDYwNHww&ixlib=rb-4.0.3&q=85",
      title: {
        name: "Donor 2",
        role: "Seo of XYZ Company",
      },
      country: "Country 2",
      city: "City 2",
      quranAyatArabic: "Quran Ayat Arabic 2",
      quranAyatEnglish: "Quran Ayat English 2",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1570126618953-d437176e8c79?crop=entropy&cs=srgb&fm=jpg&ixid=M3w2NjMyNTh8MHwxfHNlYXJjaHw5fHxjb21wYW55fGVufDB8fHx8MTczNzI5NDYwNHww&ixlib=rb-4.0.3&q=85",
      title: {
        name: "Donor 3",
        role: "Seo of PQR Company",
      },
      country: "Country 3",
      city: "City 3",
      quranAyatArabic: "Quran Ayat Arabic 3",
      quranAyatEnglish: "Quran Ayat English 3",
    },
  ];
  return (
    <div className="p-12">
      <h1 className="text-4xl font-bold">Honorable Donors List</h1>
      <div className="mt-8">
        <table className="min-w-full">
          <thead className="border-2 border-primary border-spacing-y-5 border-spacing-x-5 rounded-lg border-separate ">
            <tr>
              <th className=" py-2 text-left font-semibold text-2xl font-sans">
                Profile
              </th>
              <th className=" py-2 text-left font-semibold text-2xl font-sans">
                Name
              </th>
              <th className=" py-2 font-semibold text-2xl font-sans text-center">
                Country
              </th>
              <th className=" py-2 font-semibold text-2xl font-sans text-center">
                City
              </th>
              <th className=" py-2 font-semibold text-2xl font-sans text-right">
                <select
                  name="filter"
                  className="bg-none text-sm text-black font-semibold rounded-md max-w-20 px-5 py-3 bg-white border outline-none border-black shadow-sm cursor-pointer transition ease-in-out duration-300"
                  id=""
                >
                  <option value="all">Filter</option>
                  <option value="quranAyatArabic">Quran Ayat Arabic</option>
                  <option value="quranAyatEnglish">Quran Ayat English</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {allDonors.map((donor) => (
              <tr key={donor.id} className="border rounded-lg border-primary">
                <td className="p-5">
                  <div className="w-32 h-32 rounded-lg flex-shrink-0">
                    <img
                      className="w-full h-full rounded-lg object-cover"
                      src={donor.image}
                      alt="profile"
                    />
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="text-2xl font-semibold font-sans">
                      {donor.title.name}
                    </span>
                    <span className="text-sm font-semibold font-sans">
                      {donor.title.role}
                    </span>
                  </div>
                </td>
                <td className="p-5 text-center">{donor.country}</td>
                <td className="p-5 text-center">{donor.city}</td>
                <td className="p-5 text-right">
                  <button className="h-full px-5 bg-deleteRed">
                    {" "}
                    <RiDeleteBinLine className="text-2xl" />{" "}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="min-w-full border-separate border-spacing-y-4 border-spacing-x-2">
          <thead className="border-2 border-primary rounded-lg">
            <tr className="border-separate border-primary">
              <th className="py-2 px-4 text-left font-semibold text-2xl font-sans border-none rounded-tl-lg">
                Profile
              </th>
              <th className="py-2 px-4 text-left font-semibold text-2xl font-sans border-none">
                Name
              </th>
              <th className="py-2 px-4 font-semibold text-2xl font-sans text-center border-none">
                Country
              </th>
              <th className="py-2 px-4 font-semibold text-2xl font-sans text-center border-none">
                City
              </th>
              <th className="py-2 px-4 font-semibold text-2xl font-sans text-right border-none rounded-tr-lg">
                <select
                  name="filter"
                  className="bg-none text-sm text-black font-semibold rounded-md max-w-20 px-5 py-3 bg-white border outline-none border-black shadow-sm cursor-pointer transition ease-in-out duration-300"
                >
                  <option value="all">Filter</option>
                  <option value="quranAyatArabic">Quran Ayat Arabic</option>
                  <option value="quranAyatEnglish">Quran Ayat English</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {allDonors.map((donor, index) => (
              <tr
                key={index}
                className="border border-primary  transition duration-200"
              >
                <td className="p-5 border-none">
                  <div className="w-32 h-32 rounded-lg flex-shrink-0">
                    <img
                      className="w-full h-full rounded-lg object-cover"
                      src={donor.image}
                      alt="profile"
                    />
                  </div>
                </td>
                <td className="p-5 border-none">
                  <div className="flex flex-col">
                    <span className="text-2xl font-semibold font-sans">
                      {donor.title.name}
                    </span>
                    <span className="text-sm font-semibold font-sans">
                      {donor.title.role}
                    </span>
                  </div>
                </td>
                <td className="p-5 text-center border-none">
                  {donor.country}
                </td>
                <td className="p-5 text-center border-none">
                  {donor.city}
                </td>
                <td className="p-5 text-right border-none">
                  <button className="h-full px-5 bg-deleteRed">
                    <RiDeleteBinLine className="text-2xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
