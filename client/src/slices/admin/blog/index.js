import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define the base API
export const blogApi = createApi({
  reducerPath: "blogApi", // Unique key for this API slice
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    addBlog: builder.mutation({
      query: (formData) => ({
        url: "admin/blog/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),

    editBlog: builder.mutation({
      query: ({ id, ...formData }) => ({
        url: `admin/blog/edit/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation({
      query: ({ id }) => ({
        url: `admin/blog/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    // Fetch paginated Blogs
    getAllBlogs: builder.query({
      query: ({ page, limit }) => ({
        url: `/admin/blog/get?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),
  }),
});

// Export the auto-generated hook
export const {
  useAddBlogMutation,
  useEditBlogMutation,
  useDeleteBlogMutation,
  useGetAllBlogsQuery,
} = blogApi;
