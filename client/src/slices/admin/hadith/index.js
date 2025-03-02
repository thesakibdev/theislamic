import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const hadithApi = createApi({
  reducerPath: "hadithApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Hadith", "HadithOtherLanguage"], // ট্যাগ টাইপ ডিফাইন করা
  endpoints: (builder) => ({
    // Add a new hadith to a Hadith collection
    addHadith: builder.mutation({
      query: (formData) => ({
        url: "/admin/hadith/add",
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Hadith"], // সঠিক, কারণ এটি ডেটা মডিফাই করে
    }),

    // Add a new hadith to a HadithOtherLanguage collection
    addHadithOtherLanguage: builder.mutation({
      query: (formData) => ({
        url: "/admin/hadith/add/other-language",
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Hadith", "HadithOtherLanguage"], // সঠিক, কারণ এটি ডেটা মডিফাই করে
    }),

    // Get all hadith
    getAllHadith: builder.query({
      query: () => ({
        url: "/admin/hadith/get/all/hadith",
        method: "GET",
      }),
      providesTags: ["Hadith"], // সঠিক, কারণ এটি ডেটা ফেচ করে
    }),

    // Get all hadith by pagination
    getAllHadithByPagination: builder.query({
      query: ({ page, limit, hadithPage, hadithLimit }) => ({
        url: `/admin/hadith/get/all?page=${page}&limit=${limit}&hadithPage=${hadithPage}&hadithLimit=${hadithLimit}`,
        method: "GET",
      }),
      providesTags: ["Hadith"], // সঠিক, কারণ এটি ডেটা ফেচ করে
    }),
    getHadiths: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/admin/hadith/get/all",
        params: { page, limit, timestamp: Date.now() },
      }),
      // Transform the response to handle the nested data structure
      transformResponse: (response) => {
        if (!response.success) {
          throw new Error(response.message || "Error fetching hadiths");
        }
        return response.data;
      },
      // Provide better error handling
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          message: response.data?.message || "Error fetching hadiths",
        };
      },
      // Enable refetching on network reconnect
      providesTags: ["Hadith"],
    }),
  }),
});

export const {
  useAddHadithMutation,
  useAddHadithOtherLanguageMutation,
  useGetAllHadithByPaginationQuery,
  useGetAllHadithQuery,
  useGetHadithsQuery,
} = hadithApi;
