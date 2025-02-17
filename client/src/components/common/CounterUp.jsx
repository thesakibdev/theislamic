// import { useState, useEffect } from 'react';

// const CounterUp = () => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let targetCount = 101;
//     let interval = setInterval(() => {
//       setCount((prev) => {
//         if (prev >= targetCount) {
//           clearInterval(interval);
//           return targetCount;
//         }
//         return prev + 1;
//       });
//     }, 50);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="text-4xl font-bold text-primary text-right transition-all duration-500 ease-in-out">
//       {count}+
//     </div>
//   );
// };

// export default CounterUp;

import { useState, useEffect } from 'react';

const CounterUp = () => {
  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const targetCount = 589;

  useEffect(() => {
    let interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= targetCount) {
          clearInterval(interval);
          return targetCount;
        }
        setPrevCount(prev);
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleIncrement = () => {
    setPrevCount(count);
    setCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setPrevCount(count);
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const renderAnimatedDigits = () => {
    const countStr = count.toString().padStart(3, '0');
    const prevStr = prevCount.toString().padStart(3, '0');
    
    return countStr.split('').map((digit, index) => (
      <span
        key={index}
        className={`inline-block transition-transform duration-300 transform ${
          digit !== prevStr[index] ? 'animate-flip' : ''
        }`}
      >
        {digit}
      </span>
    ));
  };

  return (
    <div className="text-4xl font-bold text-blue-600 relative flex flex-col items-center gap-4">
      <div className="relative h-12 w-auto flex items-center justify-center overflow-hidden">
        {renderAnimatedDigits()}+
      </div>
      <div className="flex gap-2">
        <button onClick={handleIncrement} className="px-4 py-2 bg-green-500 text-white rounded transition-transform duration-300 active:scale-95">+</button>
        <button onClick={handleDecrement} className="px-4 py-2 bg-red-500 text-white rounded">-</button>
      </div>
    </div>
  );
};

export default CounterUp;