import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const hadithApi = createApi({
  reducerPath: "hadithApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Hadith", "HadithOtherLanguage"],
  endpoints: (builder) => ({
    // Add a new verse to a Surah
    addHadith: builder.mutation({
      query: (formData) => ({
        url: "/admin/hadith/add",
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Hadith"],
    }),
    getAllHadithByPagination: builder.query({
      query: ({ page, limit}) => ({
        url: `/admin/hadith/get/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      invalidatesTags: ["Hadith", "HadithOtherLanguage"],
    }),
  }),
});

export const { useAddHadithMutation, useGetAllHadithByPaginationQuery } = hadithApi;
