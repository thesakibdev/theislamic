import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const tafsirApi = createApi({
  reducerPath: "tafsirApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Tafsir"],
  endpoints: (builder) => ({
    // Add a new tafsir to a Tafsir collection
    addTafsir: builder.mutation({
      query: (formData) => ({
        url: "/admin/tafsir/create",
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Tafsir"],
    }),

    // Edit a tafsir by id
    editTafsir: builder.mutation({
      query: (formData, tafsirId, id) => ({
        url: `/admin/tafsir/edit/${id}/${tafsirId}`,
        method: "PUT",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
    }),

    // Delete a tafsir by id
    deleteTafsir: builder.mutation({
      query: (id, tafsirId) => ({
        url: `/admin/tafsir/delete/${id}/${tafsirId}`,
        method: "DELETE",
      }),
    }),

    // Get all tafsir by pagination
    getBySurah: builder.query({
      query: ({ surahNumber, language }) => ({
        url: `/admin/tafsir/get?language=${language}&surahNumber=${surahNumber}`,
        method: "GET",
      }),
      providesTags: ["Tafsir"],
    }),

    // Get all tafsir
    getAllTafsir: builder.query({
      query: ({ language, page }) => ({
        url: `/admin/tafsir-list?language=${language}&page=${page}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddTafsirMutation,
  useEditTafsirMutation,
  useDeleteTafsirMutation,
  useGetBySurahQuery,
  useGetAllTafsirQuery,
} = tafsirApi;
