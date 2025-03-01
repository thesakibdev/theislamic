import thumbnileImage from "../../assets/auth-banner.jpg";
import Profile from "../../assets/auth-profile-bg.png";

export default function Blogs() {
  return (
    <>
      <section className="pt-16 bg-slate-100 min-h-screen">
        <div className="container mx-auto p-4">
          <div>
            <h1 className="my-4 text-4xl font-semibold text-center">Blogs</h1>
          </div>
          {/* blog card */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 bg-white shadow-lg rounded-lg p-4"
              >
                <div className="object-cover w-full h-52">
                  <img
                    src={thumbnileImage}
                    className="w-full h-52 object-cover rounded-md"
                    alt=""
                  />
                </div>
                <h2 className="text-lg font-semibold">
                  Opening Day of Boating Season.
                </h2>
                <p className="text-base text-gray-400">
                  Choosing the right laptop for programming can be a tough
                  process. It’s easy to get confused while researching....
                </p>
                <div className="flex items-center gap-5">
                  <img
                    src={Profile}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col justify-between items-start">
                    <h2 className="text-base font-semibold">James</h2>
                    <p className="text-sm text-gray-600 font-semibold">
                      February 5, 2023
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
