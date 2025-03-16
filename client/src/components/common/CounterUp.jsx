const CounterUp = ({ data = "100", title }) => {
  const stringValue = data.toString();
  const numericValue = Number(stringValue.replace(/,/g, ""));
  let displayValue = stringValue;

  if (!isNaN(numericValue)) {
    if (numericValue >= 1000) {
      const inK = numericValue / 1000;
      let formattedK = inK.toFixed(1);
      if (formattedK.endsWith(".0")) {
        formattedK = formattedK.slice(0, -2);
      }
      displayValue = `${formattedK}k`;
    }
  }

  return (
    <div className="bg-primary-foreground py-10 w-full">
      <h2 className="text-white font-mono text-2xl md:text-5xl font-semibold mb-5 w-full text-center">
        {title}
      </h2>
      <div className="flex px-5 py-3 items-center justify-center w-full">
        {displayValue.split("").map((char, index) => (
          <div
            key={index}
            className="flex items-center justify-center text-6xl md:text-9xl font-bold bg-primary text-white rounded-lg mx-1 shadow-md animate-fade-in-up"
            style={{
              opacity: 0, // Initial state for animation
              animationDelay: `${index * 0.1}s`, // Stagger animation
            }}
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterUp;
