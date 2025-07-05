import { useState } from "react";
import { useSearchQuery, useSearchStatsQuery } from "../../slices/utils";

const SearchTest = () => {
  const [testQuery, setTestQuery] = useState("allah");
  const [showResults, setShowResults] = useState(false);

  const { data: searchData, isLoading, isError } = useSearchQuery(
    { query: testQuery, limit: 5 },
    { skip: !showResults }
  );

  const { data: statsData } = useSearchStatsQuery();

  const handleTest = () => {
    setShowResults(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search System Test</h2>
      
      {/* Stats */}
      {statsData && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Search Index Statistics:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-600">Total Indexed:</span>
              <div className="font-bold">{statsData.totalIndexed}</div>
            </div>
            {statsData.byType && Object.entries(statsData.byType).map(([type, count]) => (
              <div key={type}>
                <span className="text-sm text-gray-600 capitalize">{type}:</span>
                <div className="font-bold">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Search */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Test Search:</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Enter search term"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleTest}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Test Search
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Search Results:</h3>
          
          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Searching...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-4 text-red-600">
              Error occurred while searching
            </div>
          )}

          {searchData && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Query: "{searchData.query}" | Total Results: {searchData.resultCounts?.total || 0}
              </div>
              
              {searchData.results && Object.entries(searchData.results).map(([type, results]) => {
                if (!results || results.length === 0) return null;
                
                return (
                  <div key={type} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 capitalize">{type} ({results.length})</h4>
                    <div className="space-y-2">
                      {results.slice(0, 3).map((result, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="font-medium">{result.bookName || result.surahName || `Result ${index + 1}`}</div>
                          <div className="text-gray-600">
                            {result.translation?.substring(0, 100) || result.content?.substring(0, 100) || 'No preview available'}
                            {(result.translation?.length > 100 || result.content?.length > 100) && '...'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchTest; 