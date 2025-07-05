import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchSuggestionsQuery, useSearchHistoryQuery } from "../../slices/utils";
import { Search as SearchIcon, Clock, BookOpen, FileText, Book, X } from "lucide-react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localHistory, setLocalHistory] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load local search history from localStorage
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setLocalHistory(storedHistory);
  }, []);

  // Fetch server-side search history
  const { data: serverHistory } = useSearchHistoryQuery(
    { limit: 10 },
    { skip: !isDropdownOpen }
  );

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch suggestions when debounced search term changes
  const { data: suggestionsData, isLoading: isLoadingSuggestions } = useSearchSuggestionsQuery(
    { query: debouncedSearchTerm, limit: 8 },
    { skip: !debouncedSearchTerm || debouncedSearchTerm.length < 2 }
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Save search to local history
  const saveToLocalHistory = useCallback((term) => {
    if (!term.trim()) return;
    
    const updatedHistory = [
      term,
      ...localHistory.filter((item) => item !== term),
    ].slice(0, 5);
    setLocalHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  }, [localHistory]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    saveToLocalHistory(searchTerm);
    navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
    setIsDropdownOpen(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    saveToLocalHistory(suggestion);
    
    // Navigate based on suggestion type
    switch (suggestion.type) {
      case 'surah':
        navigate(`/recite/${suggestion.surahNumber}`);
        break;
      case 'hadith':
        navigate(`/search-results?query=${encodeURIComponent(suggestion)}`);
        break;
      case 'verseOther':
        navigate(`/search-results?query=${encodeURIComponent(suggestion)}`);
        break;
      case 'tafsir':
        navigate(`/tafsir/${suggestion.surahNumber}`);
        break;
      default:
        navigate(`/search-results?query=${encodeURIComponent(suggestion)}`);
    }
    
    setIsDropdownOpen(false);
  };

  // Handle history item click
  const handleHistoryClick = (item) => {
    setSearchTerm(item);
    saveToLocalHistory(item);
    navigate(`/search-results?query=${encodeURIComponent(item)}`);
    setIsDropdownOpen(false);
  };

  // Delete local history item
  const deleteLocalHistoryItem = (e, itemToDelete) => {
    e.stopPropagation();
    const updatedHistory = localHistory.filter((item) => item !== itemToDelete);
    setLocalHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  // Get icon for suggestion type
  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'surah':
        return <Book className="w-4 h-4 text-green-600" />;
      case 'hadith':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'verse':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'tafsir':
        return <BookOpen className="w-4 h-4 text-orange-600" />;
      default:
        return <SearchIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  // Get type label
  const getTypeLabel = (type) => {
    switch (type) {
      case 'surah':
        return 'Surah';
      case 'hadith':
        return 'Hadith';
      case 'verse':
        return 'Verse';
      case 'tafsir':
        return 'Tafsir';
      default:
        return 'Other';
    }
  };

  const suggestions = suggestionsData?.suggestions || [];
  const serverHistoryData = serverHistory?.history || [];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className="w-full py-4 px-6 pr-16 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-lg"
            placeholder="Search Quran, Hadith, Tafsir..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors duration-200 flex items-center gap-2"
          >
            <SearchIcon className="w-4 h-4" />
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {/* Local Search History */}
          {!searchTerm && localHistory.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches (Local)
              </h3>
              <div className="space-y-2">
                {localHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group"
                    onClick={() => handleHistoryClick(item)}
                  >
                    <span className="text-gray-700 flex-1">{item}</span>
                    <button
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => deleteLocalHistoryItem(e, item)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Server Search History */}
          {!searchTerm && serverHistoryData.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches (Server)
              </h3>
              <div className="space-y-2">
                {serverHistoryData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group"
                    onClick={() => handleHistoryClick(item.query)}
                  >
                    <div className="flex-1">
                      <span className="text-gray-700">{item.query}</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(item.createdAt).toLocaleDateString()} • {item.resultCount} results
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {searchTerm && (
            <div className="p-4">
              {isLoadingSuggestions ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Searching...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion._id}-${index}`}
                      className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.title}
                          </h4>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {getTypeLabel(suggestion.type)}
                          </span>
                        </div>
                        {suggestion.snippet && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {suggestion.snippet}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : debouncedSearchTerm.length >= 2 ? (
                <div className="text-center py-4 text-gray-500">
                  No results found for "{debouncedSearchTerm}"
                </div>
              ) : null}
            </div>
          )}

          {/* Quick Actions */}
          {!searchTerm && (
            <div className="p-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('/recite/1')}
                  className="flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  <Book className="w-4 h-4" />
                  Read Quran
                </button>
                <button
                  onClick={() => navigate('/hadith')}
                  className="flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Hadith
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
