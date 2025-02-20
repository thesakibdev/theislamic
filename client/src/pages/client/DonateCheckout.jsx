import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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
  return (
    <>
      <section className="pt-16">
        <div className="container mx-auto flex justify-between ">
          <div className="m-5 px-5 py-3 rounded-md bg-gray-200 w-3/4">
            <h2>DonorCheckout</h2>
            <div>
              <h1></h1>
            </div>
          </div>
          {/* aside */}
          <aside className="w-1/4 py-3 px-2 m-2 rounded-md">
            <div className="w-full md:w-80 p-4 bg-white shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <span className="text-blue-500">❓</span> Questions
              </h2>

              <div className="space-y-2">
                {faqData.map((item, index) => (
                  <div key={index} className="border rounded-lg">
                    <button
                      className="flex justify-between items-center w-full p-3 text-left text-gray-700 font-medium hover:bg-gray-100"
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
                <a
                  href="#"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
