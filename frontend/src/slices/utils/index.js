import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define the base API
export const utilsApi = createApi({
  reducerPath: "utilsApi", // Unique key for this API slice
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Language", "BookList"],
  endpoints: (builder) => ({
    // Global search using new SearchIndex
    search: builder.query({
      query: (searchParams) => {
        const { query, type, language, surahNumber, page = 1, limit = 50 } = searchParams;
        return {
          url: `/search`,
          params: { query, type, language, surahNumber, page, limit },
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
    }),

    // Search suggestions using new SearchIndex
    searchSuggestions: builder.query({
      query: (searchParams) => {
        const { query, limit = 10 } = searchParams;
        return {
          url: `/search/suggestions`,
          params: { query, limit },
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
    }),

    // Search history
    searchHistory: builder.query({
      query: (params) => {
        const { limit = 20 } = params || {};
        return {
          url: `/search/history`,
          params: { limit },
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
    }),

    // Search statistics
    searchStats: builder.query({
      query: () => ({
        url: `/search/stats`,
      }),
      transformResponse: (response) => {
        return response.data;
      },
    }),

    // Fetch all Surahs
    getAllLanguages: builder.query({
      query: () => ({
        url: "/utils/languages",
        method: "GET",
      }),
      providesTags: ["Language"],
    }),

    // Fetch all Book List
    getAllBookList: builder.query({
      query: () => ({
        url: "/utils/book-list",
        method: "GET",
      }),
      providesTags: ["BookList"],
    }),

    // Fetch total counter
    counter: builder.query({
      query: () => ({
        url: "/admin/analytics/total",
        method: "GET",
      }),
    }),

    // Fetch visitor counter
    visitor: builder.query({
      query: () => ({
        url: "/admin/analytics/total/counter",
        method: "GET",
      }),
    }),
  }),
});

// Export the auto-generated hook
export const {
  useSearchQuery,
  useSearchSuggestionsQuery,
  useSearchHistoryQuery,
  useSearchStatsQuery,
  useGetAllLanguagesQuery,
  useGetAllBookListQuery,
  useCounterQuery,
  useVisitorQuery,
} = utilsApi;
