import { toggleSidebar } from "@/slices/utils/utilitySlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";


export default function ReciteHeader() {
    const dispatch = useDispatch();

    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
      useEffect(() => {
        // Function to handle scroll event
        const handleScroll = () => {
          if (window.scrollY > 200) {
            setIsHeaderVisible(false);
          } else {
            setIsHeaderVisible(true);
          }
        };
    
        // Add scroll event listener
        window.addEventListener("scroll", handleScroll);
    
        // Cleanup the event listener
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);
  return (
    <nav className={`bg-primary text-white fixed top-16 left-0 w-full z-20
     ${isHeaderVisible ? " -translate-y-0" : "top-0 -translate-y-full"}`}
     >
      <div className="container mx-auto px-3 py-1 text-xl">
        <div className="flex justify-between">
          <button
            onClick={() => {
              console.log("clicked");
              dispatch(toggleSidebar());
            }}
          >
            Surah Name
          </button>
        </div>
      </div>
    </nav>
  );
}
