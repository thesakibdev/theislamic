import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define the comment API
export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    // Public endpoints
    addComment: builder.mutation({
      query: (commentData) => ({
        url: "comment/add",
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: ["Comment"],
    }),

    getApprovedComments: builder.query({
      query: ({ blogId, page = 1, limit = 10 }) => ({
        url: `comment/blog/${blogId}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),

    // Admin endpoints
    getAllComments: builder.query({
      query: ({ page = 1, limit = 20, status, blogId }) => {
        let url = `comment/admin/all?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        if (blogId) url += `&blogId=${blogId}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Comment"],
    }),

    approveComment: builder.mutation({
      query: ({ id, approvedBy }) => ({
        url: `comment/admin/approve/${id}`,
        method: "PUT",
        body: { approvedBy },
      }),
      invalidatesTags: ["Comment"],
    }),

    rejectComment: builder.mutation({
      query: ({ id }) => ({
        url: `comment/admin/reject/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),

    getCommentStats: builder.query({
      query: () => ({
        url: "comment/admin/stats",
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),

    updateAllBlogStats: builder.mutation({
      query: () => ({
        url: "comment/admin/update-all-stats",
        method: "POST",
      }),
      invalidatesTags: ["Comment", "Blog"],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useAddCommentMutation,
  useGetApprovedCommentsQuery,
  useGetAllCommentsQuery,
  useApproveCommentMutation,
  useRejectCommentMutation,
  useGetCommentStatsQuery,
  useUpdateAllBlogStatsMutation,
} = commentApi; 