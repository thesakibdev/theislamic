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
  }),
});

export const {
  useAddHadithMutation,
  useAddHadithOtherLanguageMutation,
  useGetAllHadithByPaginationQuery,
  useGetAllHadithQuery, // এখানে `useGetAllHadithQuery` হবে, কারণ এটি একটি query
} = hadithApi;
