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
  }),
});

// Export hooks for usage in functional components
export const { useAddVerseMutation } = adminApi;
