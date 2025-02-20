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
        <div className="container mx-auto flex flex-col md:flex-row justify-between ">
          <div className="rounded-md px-5 py-3 w-full md:w-3/5">
            <div className=" flex flex-col gap-3 md:gap-6">
              <h1 className="text-2xl md:text-4xl font-bold">
                💖 Join Our Mission – Transform Lives with Your Generosity
              </h1>
              <p className="text-base md:text-2xl text-left md:text-right font-amiri font-thin text">
                Becoming a donor means more than just giving; it means changing
                lives, supporting communities, and earning endless rewards from
                Allah (SWT). Whether it’s a one-time support, every donation
                makes a difference.
              </p>
              <p className="text-xl md:text-2xl font-medium text-justify">
                📢 Your donation will help us continue our mission to provide
                free access to the Quran, Hadith, and other Islamic resources.
                We rely on the generosity of donors like you to keep our
                services free and accessible to all.
              </p>
            </div>
            {/* donation form */}
            <div className="mt-8 rounded-lg">
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
                      donationAmount === amount
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                    type="button"
                    style={{
                      backgroundColor:
                        donationAmount === amount ? "blue" : "transparent",
                    }}
                    value={amount}
                    onClick={() => setDonationAmount(amount)}
                  >
                    ৳{amount}
                  </button>
                ))}
                <div className="col-span-2 flex items-center">
                  <label className="block text-lg font-medium bg-primary text-white text-center p-2 rounded-l-lg">
                    Other
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="৳ Other"
                    className="p-2 border outline-none rounded-r-lg text-lg w-full bg-primary text-white"
                  />
                </div>
              </div>

              {/* Form Start */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 mt-10"
              >
                <h2 className="text-2xl font-semibold">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="block text-lg font-normal">
                      Full Name *
                    </label>
                    <input
                      {...register("Name", { required: true })}
                      type="text"
                      className={`w-full p-2 border outline-none focus:border-primary rounded-lg ${
                        errors.Name ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="block text-lg font-normal">
                      Father Name
                    </label>
                    <input
                      {...register("fatherName", { required: false })}
                      type="text"
                      className={`w-full p-2 border outline-none focus:border-primary rounded-lg ${
                        errors.fatherName ? "border-red-500" : ""
                      }`}
                      placeholder="Enter Father name"
                    />
                  </div>
                </div>
                {/* Checkboxes */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hide-name"
                    className="w-4 accent-primary h-4"
                  />
                  <label htmlFor="hide-name" className="text-sm">
                    Hide my name from the public.
                  </label>
                </div>

                {/* Email && phone Field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="block text-lg font-normal">Email *</label>
                    <input
                      {...register("email", { required: true })}
                      type="email"
                      className={`w-full p-2 border outline-none focus:border-primary rounded-lg ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="block text-lg font-normal">
                      Phone Number *
                    </label>
                    <input
                      {...register("phone", { required: true })}
                      type="phone"
                      className={`w-full p-2 border outline-none focus:border-primary rounded-lg ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 my-2">
                  <input
                    type="checkbox"
                    id="contact-ok"
                    className="w-4 h-4 accent-primary"
                    defaultChecked
                  />
                  <label htmlFor="contact-ok" className="text-sm text-pr">
                    It is okay to contact me in the future.
                  </label>
                </div>

                {/* Profession && designation Field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="block text-lg font-normal">
                      Profession
                    </label>
                    <input
                      {...register("profession")}
                      type="text"
                      className={`w-full p-2 border outline-none focus:border-primary rounded-lg ${
                        errors.profession ? "border-red-500" : ""
                      }`}
                      placeholder="Your profession"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="block text-lg font-normal">
                      Designation
                    </label>
                    <input
                      {...register("designation")}
                      type="text"
                      className={`w-full p-2 border outline-none focus:border-primary rounded-lg ${
                        errors.designation ? "border-red-500" : ""
                      }`}
                      placeholder="Your designation"
                    />
                  </div>
                </div>

                {/* Address Field */}
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="block text-lg font-normal">
                        Street *
                      </label>
                      <input
                        {...register("street", { required: true })}
                        type="street"
                        className={`w-full p-2 border outline-none focus:border-primary rounded-lg ${
                          errors.street ? "border-red-500" : ""
                        }`}
                        placeholder="Your street"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="block text-lg font-normal">
                        Zip Code *
                      </label>
                      <input
                        {...register("zipCode", { required: true })}
                        type="number"
                        className={`w-full p-2 border outline-none focus:border-primary rounded-lg ${
                          errors.zipCode ? "border-red-500" : ""
                        }`}
                        placeholder="Your Zip Code"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="block text-lg font-normal">
                        City *
                      </label>
                      <input
                        {...register("city", { required: true })}
                        type="text"
                        className={`w-full p-2 border outline-none focus:border-primary rounded-lg ${
                          errors.city ? "border-red-500" : ""
                        }`}
                        placeholder="Your city"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="block text-lg font-normal">
                        Country *
                      </label>
                      <input
                        {...register("country", { required: true })}
                        type="text"
                        className={`w-full p-2 border outline-none focus:border-primary rounded-lg ${
                          errors.country ? "border-red-500" : ""
                        }`}
                        placeholder="Your Country"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="block text-lg font-normal">
                      Company Name *
                    </label>
                    <input
                      {...register("companyName", { required: true })}
                      type="text"
                      className={`w-full p-2 border outline-none focus:border-primary rounded-lg ${
                        errors.companyName ? "border-red-500" : ""
                      }`}
                      placeholder="Your city"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="block text-lg font-normal">
                      Total Donation *
                    </label>
                    <input
                      {...register("TotalDonation", { required: true })}
                      type="number"
                      className={`w-full p-2 border outline-none focus:border-primary rounded-lg ${
                        errors.TotalDonation ? "border-red-500" : ""
                      }`}
                      placeholder="Your Zip Code"
                    />
                  </div>
                </div>

                {/* submittion  */}
                <div className="border-t pt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-primary">
                  <div className="">
                    <div className="w-full items-center flex gap-1 mb-4">
                      <label className="text-xl"> One Time Donation:</label>
                      <p className="text-2xl underline font-bold">
                        <span className="text-primary">৳</span>{" "}
                        {donationAmount ? `${donationAmount}` : "0.00"}{" "}
                      </p>
                    </div>
                    <div>
                      <p className="text-base md:text-lg text-gray-600">
                        By donating, you agree to our{" "}
                        <Link
                          to="/terms"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-start gap-2">
                      <input
                        type="checkbox"
                        id="privacy"
                        className="w-5 md:w-12 h-5 md:h-12 accent-primary "
                      />
                      <label htmlFor="privacy" className="text-base">
                        I'd like to cover the transaction fees for this donation
                        so more of my donation goes to the Islamics Foundation.
                      </label>
                    </div>
                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-primary font-bold text-white rounded-lg hover:bg-primary-foreground hover:text-black"
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* aside */}
          <aside className="w-full md:w-2/5 py-3 px-2 m-2 rounded-md">
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
