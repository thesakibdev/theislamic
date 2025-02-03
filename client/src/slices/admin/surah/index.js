import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Surah", "Verse"],
  endpoints: (builder) => ({
    // Add a new verse to a Surah
    addVerse: builder.mutation({
      query: (formData) => ({
        url: "/admin/surah/add/verse",
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Surah", "Verse"],
    }),

    // Edit Arabic text of a specific verse
    editArabicVerse: builder.mutation({
      query: ({ surahNumber, verseNumber, ...formData }) => (
        console.log(formData),
        {
          url: `/admin/surahs/${surahNumber}/verses/${verseNumber}/edit-arabic`,
          method: "PUT",
          body: formData,
          headers: { "Content-Type": "application/json" },
        }
      ),
      invalidatesTags: ["Surah", "Verse"],
    }),

    // Delete a specific verse
    deleteVerse: builder.mutation({
      query: ({ surahNumber, verseNumber }) => ({
        url: `/admin/surahs/${surahNumber}/verses/${verseNumber}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Surah", "Verse"],
    }),

    // Add other verse data (translations, transliterations, etc.)
    addVerseOtherData: builder.mutation({
      query: (formData) => ({
        url: "/admin/surah/add/verse-other",
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Surah", "Verse"],
    }),

    // Edit other verse data
    editVerseOtherData: builder.mutation({
      query: ({ surahNumber, verseNumber, language, ...formData }) => ({
        url: `/admin/surah/verse-other-data/${surahNumber}/${verseNumber}/${language}`,
        method: "PUT",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Surah", "Verse"],
    }),

    // Delete other verse data
    deleteVerseOtherData: builder.mutation({
      query: ({ surahNumber, verseNumber, language }) => ({
        url: `/admin/surah/verse-other-data/${surahNumber}/${verseNumber}/${language}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Surah", "Verse"],
    }),

    // Fetch all Surahs
    getAllSurahs: builder.query({
      query: () => ({
        url: "/admin/surah/all",
        method: "GET",
      }),
      providesTags: ["Surah", "Verse"],
    }),

    // Fetch paginated Surahs
    getAllSurahsPaginated: builder.query({
      query: ({ page = 1, limit = 1 }) => ({
        url: `/admin/surah/paginated?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Surah", "Verse"],
    }),
  }),
});

export const {
  useAddVerseMutation,
  useEditArabicVerseMutation,
  useDeleteVerseMutation,
  useAddVerseOtherDataMutation,
  useEditVerseOtherDataMutation,
  useDeleteVerseOtherDataMutation,
  useGetAllSurahsQuery,
  useGetAllSurahsPaginatedQuery,
} = adminApi;
