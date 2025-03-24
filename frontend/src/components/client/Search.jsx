import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // লোকাল স্টোরেজ থেকে সার্চ হিস্টোরি লোড করা
  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(storedHistory);
  }, []);

  // ইনপুট বক্সের বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করা
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // সার্চ হ্যান্ডলার ফাংশন
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // লোকাল স্টোরেজে হিস্টোরি সংরক্ষণ
    const updatedHistory = [
      searchTerm,
      ...history.filter((item) => item !== searchTerm),
    ].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    // ইউজারকে নতুন রেজাল্ট পেজে পাঠানো (Dynamic Route)
    navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
    setIsDropdownOpen(false); // সার্চের পর dropdown বন্ধ করা
  };

  // নির্দিষ্ট হিস্টোরি আইটেম ডিলিট করা
  const deleteHistoryItem = (itemToDelete) => {
    const updatedHistory = history.filter((item) => item !== itemToDelete);
    setHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const handleItemClick = (item) => {
    console.log("Item clicked", item);
    setSearchTerm(item);
    setIsDropdownOpen(false);
    setTimeout(() => {
      navigate(`/search-results?query=${encodeURIComponent(item)}`);
    }, 0); // নেভিগেশন ঠিক করার জন্য সামান্য ডিলে
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          className="w-full py-3 px-4 border rounded-md"
          placeholder="Search here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)} // শুধু ক্লিক করলে dropdown show করবে
        />
        <button
          type="submit"
          className="absolute right-3 top-3 bg-blue-500 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </form>

      {/* সার্চ হিস্টোরি দেখানো (শুধু ইনপুটে ক্লিক করলে) */}
      {isDropdownOpen && history.length > 0 && (
        <ul className="absolute bg-white w-full border mt-1 rounded-md shadow-md">
          {history.map((item, index) => (
            <li
              key={index}
              className="flex justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() =>
                navigate(`/search-results?query=${encodeURIComponent(item)}`)
              }
            >
              <span onClick={() => handleItemClick(item)}>{item}</span>
              <button
                className="text-red-500 ml-4"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigating
                  deleteHistoryItem(item);
                }}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
