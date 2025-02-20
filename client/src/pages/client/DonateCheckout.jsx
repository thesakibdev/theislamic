import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const faqData = [
  {
    question: "Is this donation tax deductible?",
    answer: "Yes, all donations are tax deductible as per applicable laws.",
  },
  {
    question: "Can I donate using PayPal?",
    answer:
      "Yes, we accept donations through PayPal, credit cards, and bank transfers.",
  },
  {
    question: "Is this donation zakat-eligible?",
    answer:
      "Yes, your donation is eligible for Zakat and will be used accordingly.",
  },
];
export default function DonateCheckout() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const [donationAmount, setDonationAmount] = useState();
  console.log(donationAmount);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    data.donationAmount = donationAmount;
    console.log("Form Data:", data);
    reset();
  };
  return (
    <>
      <section className="pt-16">
        <div className="container mx-auto flex justify-between ">
          <div className="m-5 px-5 py-3 rounded-md  w-3/5">
            <h2>DonorCheckout</h2>
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-bold">
                💖 Join Our Mission – Transform Lives with Your Generosity
              </h1>
              <p className="text-2xl text-right font-amiri font-thin text">
                Becoming a donor means more than just giving; it means changing
                lives, supporting communities, and earning endless rewards from
                Allah (SWT). Whether it’s a one-time support, every donation
                makes a difference.
              </p>
              <p className="text-2xl font-medium text-justify">
                📢 Your donation will help us continue our mission to provide
                free access to the Quran, Hadith, and other Islamic resources.
                We rely on the generosity of donors like you to keep our
                services free and accessible to all.
              </p>
            </div>
            {/* donation form */}
            <div className="mt-8 rounded-lg">
              {/* <h2 className="text-2xl text-center font-semibold mb-4">
                Make a Donation
              </h2> */}

              {/* Donation Type Toggle */}
              <div className="flex justify-between bg-gray-100 p-1 rounded-lg mb-4">
                <h2 className="flex-1 p-2 text-xl text-center rounded-lg text-black">
                  Make a One-time Donation
                </h2>
              </div>

              {/* Donation Amount */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
                {["10000", "5000", "1000", "500"].map((amount) => (
                  <button
                    key={amount}
                    className={`p-2 border rounded-lg w-full text-center ${
                      donationAmount === amount ? 'bg-blue-600 text-white' : 'bg-gray-100'
                    }`}
                    type="button"
                    style={{ backgroundColor: donationAmount === amount ? 'blue' : 'transparent' }}
                    value={amount}
                    onClick={() => setDonationAmount(amount)}
                  >
                    ৳{amount}
                  </button>
                ))}
                <div className="col-span-2 flex items-center">
                  <label className="block text-lg font-medium bg-primary text-white text-center p-2 rounded-l-lg">Other</label>
                  <input
                    type="number"
                    placeholder="৳ Other"
                    className="p-2 border outline-none rounded-r-lg text-lg w-full bg-primary text-white"
                  />
                </div>
              </div>

              {/* Form Start */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      First Name *
                    </label>
                    <input
                      {...register("firstName")}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Last Name *
                    </label>
                    <input
                      {...register("lastName")}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium">Email *</label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-sm font-medium">Address *</label>
                  <input
                    {...register("address")}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your address"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="hide-name" className="w-4 h-4" />
                  <label htmlFor="hide-name" className="text-sm">
                    Hide my name from the public.
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="contact-ok"
                    className="w-4 h-4"
                    defaultChecked
                  />
                  <label htmlFor="contact-ok" className="text-sm">
                    It is okay to contact me in the future.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Donate Now
                </button>
              </form>
            </div>
          </div>

          {/* aside */}
          <aside className="w-2/5 py-3 px-2 m-2 rounded-md">
            <div className="w-full h-full p-4 bg-white  rounded-lg">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                Questions
              </h2>

              <div className="space-y-2">
                {faqData.map((item, index) => (
                  <div key={index} className=" rounded-lg">
                    <button
                      className="flex justify-between items-center w-full p-3 text-left text-black font-medium "
                      onClick={() => toggleAccordion(index)}
                    >
                      {item.question}
                      {openIndex === index ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                    {openIndex === index && (
                      <p className="p-3 text-gray-600">{item.answer}</p>
                    )}
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm text-gray-600">
                Have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
