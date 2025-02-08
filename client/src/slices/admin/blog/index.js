import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define the base API
export const blogApi = createApi({
  reducerPath: "blogApi", // Unique key for this API slice
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  endpoints: (builder) => ({
    addBlog: builder.mutation({
      query: (formData) => ({
        url: "admin/blog/add",
        method: "POST",
        body: formData,
      }),
    }),

    editBlog: builder.mutation({
      query: ({ id, ...formData }) => ({
        url: `admin/blog/edit/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

// Export the auto-generated hook
export const {
  useUploadImageMutation,
  useAddBlogMutation,
  useEditBlogMutation,
} = blogApi;
