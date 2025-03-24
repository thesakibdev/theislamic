import React, { useState } from "react";
import { useGlobalSearchQuery } from "../../slices/utils"; // RTK Query

export default function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const { data, error, isLoading } = useGlobalSearchQuery({ keywords: searchText });

  const handleSearch = (e) => {
    e.preventDefault();
    "note" in data ? console.log("data.note") : console.log("no data.note");
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="What you want to know from Quran & Hadith?"
          className="p-2 w-full rounded border"
        />
      </form>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      {data?.hadithResults?.length > 0 && (
        <div>
          <h2>Hadith Results:</h2>
          {data.hadithResults.map((hadith, index) => (
            <div key={index}>{JSON.stringify(hadith)}</div>
          ))}
        </div>
      )}

      {data?.verseResults?.length > 0 && (
        <div>
          <h2>Verse Results:</h2>
          {data.verseResults.map((verse, index) => (
            <div key={index}>{JSON.stringify(verse)}</div>
          ))}
        </div>
      )}

      {data?.surahResults?.length > 0 && (
        <div>
          <h2>Surah Results:</h2>
          {data.surahResults.map((surah, index) => (
            <div key={index}>{JSON.stringify(surah)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
