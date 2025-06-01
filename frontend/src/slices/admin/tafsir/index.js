import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const tafsirApi = createApi({
  reducerPath: "tafsirApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Tafsir"], // ট্যাগ টাইপ ডিফাইন করা
  endpoints: (builder) => ({
    // Add a new tafsir to a Tafsir collection
    addTafsir: builder.mutation({
      query: (formData) => ({
        url: "/admin/tafsir/create",
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Tafsir"], // সঠিক, কারণ এটি ডেটা মডিফাই করে
    }),

    // Edit a tafsir by id
    editTafsir: builder.mutation({
      query: (formData) => ({
        url: "/admin/tafsir/edit/:id",
        method: "PUT",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
    }),

    // Delete a tafsir by id
    deleteTafsir: builder.mutation({
      query: (id) => ({
        url: `/admin/tafsir/delete/${id}`,
        method: "DELETE",
      }),
    }),

    // Get all tafsir by pagination
    getAllTafsirByPagination: builder.query({
      query: ({ page, limit, language }) => ({
        url: `/admin/tafsir/get?language=${language}&limit=${limit}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["Tafsir"], // সঠিক, কারণ এটি ডেটা ফেচ করে
    }),
  }),
});

export const {
  useAddTafsirMutation,
  useEditTafsirMutation,
  useDeleteTafsirMutation,
  useGetAllTafsirByPaginationQuery,
} = tafsirApi;
