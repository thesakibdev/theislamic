import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define the base API
export const utilsApi = createApi({
  reducerPath: "utilsApi", // Unique key for this API slice
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Language", "BookList"],
  endpoints: (builder) => ({
    // Fetch all Surahs
    getAllLanguages: builder.query({
      query: () => ({
        url: "/utils/languages",
        method: "GET",
      }),
      providesTags: ["Language"],
    }),
    getAllBookList: builder.query({
      query: () => ({
        url: "/utils/book-list",
        method: "GET",
      }),
      providesTags: ["BookList"],
    }),
    globalSearch: builder.query({
      query: (params) => ({
        url: "/search",
        params,
      }),
    }),
  }),
});

// Export the auto-generated hook
export const {
  useGetAllLanguagesQuery,
  useGetAllBookListQuery,
  useGlobalSearchQuery,
} = utilsApi;
