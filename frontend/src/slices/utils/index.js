import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define the base API
export const utilsApi = createApi({
  reducerPath: "utilsApi", // Unique key for this API slice
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Language", "BookList"],
  endpoints: (builder) => ({
    // globalSearch
    search: builder.query({
      query: (searchParams) => {
        const { query, page = 1, limit = 20 } = searchParams;
        return {
          url: `/search`,
          params: { query, page, limit },
        };
      },
      transformResponse: (response) => {
        // ফেরত আসা ডাটা প্রসেস করা (যদি প্রয়োজন হয়)
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
  useGetAllLanguagesQuery,
  useGetAllBookListQuery,
  useCounterQuery,
  useVisitorQuery,
} = utilsApi;
