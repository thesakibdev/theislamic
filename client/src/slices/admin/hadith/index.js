import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const hadithApi = createApi({
  reducerPath: "hadithApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Hadith", "HadithOtherLanguage"],
  endpoints: (builder) => ({
    // Add a new hadith to a Hadith collection
    addHadith: builder.mutation({
      query: (formData) => ({
        url: "/admin/hadith/add",
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Hadith"],
    }),
    // Add a new hadith to a HadithOtherLanguage collection
    addHadithOtherLanguage: builder.mutation({
      query: (formData) => ({
        url: "/admin/hadith/add/other-language",
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Hadith", "HadithOtherLanguage"],
    }),
    getAllHadithByPagination: builder.query({
      query: ({ page, limit }) => ({
        url: `/admin/hadith/get/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      invalidatesTags: ["Hadith", "HadithOtherLanguage"],
    }),
  }),
});

export const {
  useAddHadithMutation,
  useAddHadithOtherLanguageMutation,
  useGetAllHadithByPaginationQuery,
} = hadithApi;
