import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define the base API
export const donorApi = createApi({
  reducerPath: "donorApi", // Unique key for this API slice
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Donor"],
  endpoints: (builder) => ({
    addDonor: builder.mutation({
      query: (formData) => ({
        url: "/donor/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Donor"],
    }),

    editDonor: builder.mutation({
      query: ({ id, ...formData }) => ({
        url: `/donor/edit/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Donor"],
    }),
    deleteDonor: builder.mutation({
      query: (id) => ({
        url: `/donor/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Donor"],
    }),

    // donor history api
    addNewDonationHistory: builder.mutation({
      query: ({ donorId, ...formData }) => ({
        url: `/donor/add-history/${donorId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Donor"],
    }),

    editDonationHistory: builder.mutation({
      query: ({ donorId, historyId, ...formData }) => ({
        url: `/donor/edit/history/${donorId}/${historyId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Donor"],
    }),

    deleteDonorHistory: builder.mutation({
      query: ({ donorId, historyId }) => ({
        url: `/donor/delete/history/${donorId}/${historyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Donor"],
    }),

    // Fetch paginated Donors
    getAllDonors: builder.query({
      query: ({ page, limit }) => ({
        url: `/donor/get?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Donor"],
    }),

    // Minimal donor list for dropdowns
    getMinimalDonors: builder.query({
      query: () => ({
        url: "/donor/list-minimal",
        method: "GET",
      }),
      providesTags: ["Donor"],
      transformResponse: (response) => response.donors || [],
    }),
  }),
});

// Export the auto-generated hook
export const {
  useAddDonorMutation,
  useEditDonorMutation,
  useDeleteDonorMutation,
  useGetAllDonorsQuery,
  useAddNewDonationHistoryMutation,
  useEditDonationHistoryMutation,
  useDeleteDonorHistoryMutation,
  useGetMinimalDonorsQuery,
} = donorApi;
