// import { useEffect } from "react";
const CounterUp = ({ data = "100", title }) => {
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     data?.data;
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [data?.data]);

  return (
    <div className="bg-primary-foreground py-10 w-full">
      <h2 className="text-white font-mono text-2xl md:text-5xl font-semibold mb-5 w-full text-center">
        {title}
      </h2>
      <div className="flex px-5 py-3 items-center justify-center w-full">
        {data
          .toString()
          .split("")
          .map((num, index) => (
            <div
              key={index}
              className=" flex items-center justify-center text-6xl md:text-9xl font-bold bg-primary text-white rounded-lg mx-1 shadow-md"
            >
              {num}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CounterUp;
