import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;
console.log(baseUrl);

export const tafsirApi = createApi({
  reducerPath: "tafsirApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["tafsir"],
  endpoints: (builder) => ({
    // Add a new tafsir
    addTafsir: builder.mutation({
      query: (formData) => ({
        url: "/admin/tafsir/add",
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["tafsir"],
    }),

    // Edit an existing tafsir
    editTafsir: builder.mutation({
      query: ({ id, language, bookName, ...formData }) => (
        console.log(id, bookName, language),
        {
          url: `/admin/tafsir/edit/${language}/${id}/${bookName}`,
          method: "PUT",
          body: formData,
          headers: { "Content-Type": "application/json" },
        }
      ),
      invalidatesTags: ["tafsir"],
    }),

    // Delete a specific tafsir
    deleteTafsir: builder.mutation({
      query: ({ id, language, bookName }) => (
        console.log(id, language, bookName),
        {
          url: `/admin/tafsir/delete/${language}/${id}/${bookName}`,
          method: "DELETE",
        }
      ),
      invalidatesTags: ["tafsir"],
    }),

    // Fetch paginated Tafsir data
    getAllTafsirPaginated: builder.query({
      query: ({ language, bookName, page = 1, limit = 10 }) => ({
        url: `/admin/tafsir/get?language=${language}&bookName=${bookName}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      // Add cache key configuration
      serializeQueryArgs: ({ queryArgs }) => {
        return `${queryArgs.language}_${queryArgs.bookName}`;
      },
      // Transform response to handle errors
      transformResponse: (response) => {
        if (!response.success) {
          throw new Error(response.message || "Error fetching data");
        }
        return response;
      },
      // Handle errors by clearing cache
      transformErrorResponse: () => {
        return [];
      },
      // Merge strategy
      merge: (currentCache, newItems) => {
        if (!newItems.success) {
          return undefined;
        }
        return newItems;
      },
      // Invalidate cache on error
      invalidatesTags: (result, error, { language, bookName }) =>
        error ? [{ type: "tafsir", id: `${language}_${bookName}` }] : [],
      providesTags: (result, error, { language, bookName }) => [
        { type: "tafsir", id: `${language}_${bookName}` },
      ],
    }),
  }),
});

export const {
  useAddTafsirMutation,
  useEditTafsirMutation,
  useDeleteTafsirMutation,
  useGetAllTafsirPaginatedQuery,
} = tafsirApi;
