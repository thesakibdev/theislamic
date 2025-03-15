import { useEffect, useState } from "react";
import { useCounterQuery } from "@/slices/utils";

const CounterUp = () => {
  const { data } = useCounterQuery();
  const [count, setCount] = useState( 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-foreground py-10">
      <h2 className="text-white font-mono text-2xl md:text-5xl font-semibold mb-5">
        The Islamics Visitor Count
      </h2>
      <div className="flex px-5 py-3">
        {count
          .toString()
          .split("")
          .map((num, index) => (
            <div
              key={index}
              className="w-16 h-28 md:w-36 md:h-52 flex items-center justify-center text-6xl md:text-9xl font-bold bg-primary text-white rounded-lg mx-1 shadow-md"
            >
              {num}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CounterUp;
