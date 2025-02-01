import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL; // Example: "http://localhost:5000/api/v1"

// Define a service using a base URL and expected endpoints
export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Surah", "Verse"],
  endpoints: (builder) => ({
    // Add a new verse to a Surah
    addVerse: builder.mutation({
      query: (formData) => {
        console.log("Sending data:", formData);
        console.log("Request payload:", JSON.stringify(formData, null, 2));
        return {
          url: "/admin/surah/add-verse",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      transformResponse: (response) => {
        console.log("Response:", response);
        return response;
      },
      invalidatesTags: ["Surah", "Verse"],
    }),

    // Edit a specific verse in a Surah
    editVerse: builder.mutation({
      query: ({ surahNumber, verseNumber, ...formData }) => ({
        url: `/admin/surah/${surahNumber}/verse/${verseNumber}`,
        method: "PUT",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Surah", "Verse"],
    }),

    // Delete a specific verse from a Surah
    deleteVerse: builder.mutation({
      query: ({ surahNumber, verseNumber }) => ({
        url: `/admin/surah/${surahNumber}/verse/${verseNumber}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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

    // Fetch Surahs with pagination
    getAllSurahsPaginated: builder.query({
      query: ({ page = 1, limit = 5 }) => ({
        url: `/admin/surah/paginated?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Surah", "Verse"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useAddVerseMutation,
  useEditVerseMutation,
  useDeleteVerseMutation,
  useGetAllSurahsQuery,
  useGetAllSurahsPaginatedQuery,
} = adminApi;
