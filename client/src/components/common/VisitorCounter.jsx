import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VisitorCounter = () => {
  const [count, setCount] = useState(67890); // Initial visitor count

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 3000); // Increase count every 3 seconds (for demo)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center gap-2 p-5 bg-orange-500 min-h-screen">
      {count.toString().split("").map((digit, index) => (
        <FlipCard key={index} digit={digit} />
      ))}
    </div>
  );
};

const FlipCard = ({ digit }) => {
  return (
    <div className="relative w-16 h-24 text-white text-5xl font-bold flex justify-center items-center bg-blue-500 rounded-lg overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default VisitorCounter;