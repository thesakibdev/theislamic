import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define a service using a base URL and expected endpoints
export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: [
    "chapterNumber",
    "surahNumber",
    "surahName",
    "verseNumber",
    "arabicText",
    "translations",
    "transliteration",
  ],
  endpoints: (builder) => ({
    addVerse: builder.mutation({
      query: (formData) => ({
        url: "admin/quran/chapter/surah/verse",
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        "chapterNumber",
        "surahNumber",
        "surahName",
        "verseNumber",
        "arabicText",
        "translations",
        "transliteration",
      ],
    }),
    // Edit Verse
    editVerse: builder.mutation({
      query: ({ chapterNumber, surahNumber, verseNumber, formData }) => ({
        url: `admin/quran/chapter/surah/verse/edit`,
        method: "POST",
        body: { chapterNumber, surahNumber, verseNumber, ...formData },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        "chapterNumber",
        "surahNumber",
        "surahName",
        "verseNumber",
        "arabicText",
        "translations",
        "transliteration",
      ],
    }),

    // Delete Verse
    deleteVerse: builder.mutation({
      query: ({ chapterNumber, surahNumber, verseNumber }) => ({
        url: `admin/quran/chapter/surah/verse/delete`,
        method: "DELETE",
        body: { chapterNumber, surahNumber, verseNumber },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        "chapterNumber",
        "surahNumber",
        "surahName",
        "verseNumber",
        "arabicText",
        "translations",
        "transliteration",
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useAddVerseMutation,
  useEditVerseMutation,
  useDeleteVerseMutation,
} = adminApi;
