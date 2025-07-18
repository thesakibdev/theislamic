import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define the base API
export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Account", "Transaction"],
  endpoints: (builder) => ({
    // Create a new transaction
    createTransaction: builder.mutation({
      query: (formData) => ({
        url: "/account/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Account", "Transaction"],
    }),

    // Get all transactions
    getTransactions: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/account/transactions?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Transaction"],
      transformResponse: (response) => response.transactions ? response : { transactions: [], ...response },
    }),

    // Get account summary
    getAccountSummary: builder.query({
      query: () => ({
        url: `/account/summary`,
        method: "GET",
      }),
      providesTags: ["Account"],
      transformResponse: (response) => response.summary ? response.summary : response,
    }),

    // Update a transaction
    updateTransaction: builder.mutation({
      query: ({ transactionId, ...formData }) => ({
        url: `/account/transaction/${transactionId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Account", "Transaction"],
    }),

    // Delete a transaction
    deleteTransaction: builder.mutation({
      query: (transactionId) => ({
        url: `/account/transaction/${transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Account", "Transaction"],
    }),

    // Get all accounts (admin only)
    getAllAccounts: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/account/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Account"],
    }),
  }),
});

export const {
  useCreateTransactionMutation,
  useGetTransactionsQuery,
  useGetAccountSummaryQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetAllAccountsQuery,
} = accountApi; 