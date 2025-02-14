export default function DonorPage() {
  const donorList = [
    {
      name: "John Doe",
      avatar: "",
      profession: "Software Engineer",
      companyName: "ABC Company",
      designation: "CEO",
      street: "Street 1",
      city: "City 1",
      country: "Country 1",
    },
    {
      name: "John Doe",
      avatar: "",
      profession: "Software Engineer",
      companyName: "ABC Company",
      designation: "CEO",
      street: "Street 1",
      city: "City 1",
      country: "Country 1",
    },
    {
      name: "John Doe",
      avatar: "",
      profession: "Software Engineer",
      companyName: "ABC Company",
      designation: "CEO",
      street: "Street 1",
      city: "City 1",
      country: "Country 1",
    },
    {
      name: "John Doe",
      avatar: "",
      profession: "Software Engineer",
      companyName: "ABC Company",
      designation: "CEO",
      street: "Street 1",
      city: "City 1",
      country: "Country 1",
    },
    {
      name: "John Doe",
      avatar: "",
      profession: "Software Engineer",
      companyName: "ABC Company",
      designation: "CEO",
      street: "Street 1",
      city: "City 1",
      country: "Country 1",
    },
  ];

  return (
    <section className="pt-[4.5rem] md:pt-40">
      <div className="container mx-auto px-4">
        <div className="">
          <h1 className="text-4xl font-semibold text-center">
            Honorable Donor List
          </h1>
          <div className="">
            {donorList.map((donor) => (
              <div
                key={donor.name}
                className="border p-4 grid md:grid-cols-4 items-center justify-between my-6 gap-2"
              >
                {donor.avatar === "" ? (
                  <div className="w-[100px] h-[100px] mx-auto bg-gray-300"></div>
                ) : (
                  <img src={donor.avatar} alt={donor.name} />
                )}
                <div className="md:col-span-3">
                  <h2>Name: {donor.name}</h2>
                  <div className="grid md:grid-cols-3">
                    <p>Profession: {donor.profession}</p>
                    <p>Company: {donor.companyName}</p>
                    <p>Designation: {donor.designation}</p>
                    <p>Street: {donor.street}</p>
                    <p>City: {donor.city}</p>
                    <p>Country: {donor.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
