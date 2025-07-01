import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define the base API
export const accountingApi = createApi({
  reducerPath: "accountingApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Account", "Transaction", "Journal", "Report"],
  endpoints: (builder) => ({
    // Account Management
    createAccount: builder.mutation({
      query: (accountData) => ({
        url: "/accounting/accounts",
        method: "POST",
        body: accountData,
      }),
      invalidatesTags: ["Account"],
    }),

    getAllAccounts: builder.query({
      query: ({ type, active } = {}) => {
        const params = new URLSearchParams();
        if (type) params.append("type", type);
        if (active !== undefined) params.append("active", active);
        return {
          url: `/accounting/accounts${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Account"],
    }),

    getAccountById: builder.query({
      query: (id) => ({
        url: `/accounting/accounts/${id}`,
        method: "GET",
      }),
      providesTags: ["Account"],
    }),

    updateAccount: builder.mutation({
      query: ({ id, ...accountData }) => ({
        url: `/accounting/accounts/${id}`,
        method: "PUT",
        body: accountData,
      }),
      invalidatesTags: ["Account"],
    }),

    // Transaction Management
    addTransaction: builder.mutation({
      query: (transactionData) => ({
        url: "/accounting/transactions",
        method: "POST",
        body: transactionData,
      }),
      invalidatesTags: ["Transaction", "Account", "Journal", "Report"],
    }),

    getTransactions: builder.query({
      query: ({ accountName, startDate, endDate, limit } = {}) => {
        const params = new URLSearchParams();
        if (accountName) params.append("accountName", accountName);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (limit) params.append("limit", limit);
        return {
          url: `/accounting/transactions${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Transaction"],
    }),

    getTransactionById: builder.query({
      query: (id) => ({
        url: `/accounting/transactions/${id}`,
        method: "GET",
      }),
      providesTags: ["Transaction"],
    }),

    // Journal Management
    getJournal: builder.query({
      query: ({ startDate, endDate, limit } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (limit) params.append("limit", limit);
        return {
          url: `/accounting/journal${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Journal"],
    }),

    getJournalById: builder.query({
      query: (id) => ({
        url: `/accounting/journal/${id}`,
        method: "GET",
      }),
      providesTags: ["Journal"],
    }),

    // Ledger Management
    getAccountLedger: builder.query({
      query: ({ accountName, startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return {
          url: `/accounting/ledger/${accountName}${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Account"],
    }),

    // Financial Reports
    getBalanceSheet: builder.query({
      query: ({ asOfDate } = {}) => {
        const params = new URLSearchParams();
        if (asOfDate) params.append("asOfDate", asOfDate);
        return {
          url: `/accounting/reports/balance-sheet${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Report"],
    }),

    getIncomeStatement: builder.query({
      query: ({ startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return {
          url: `/accounting/reports/income-statement${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Report"],
    }),

    getTrialBalance: builder.query({
      query: ({ asOfDate } = {}) => {
        const params = new URLSearchParams();
        if (asOfDate) params.append("asOfDate", asOfDate);
        return {
          url: `/accounting/reports/trial-balance${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Report"],
    }),

    // Dashboard/Summary
    getAccountingSummary: builder.query({
      query: ({ startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return {
          url: `/accounting/summary${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Report"],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  // Account Management
  useCreateAccountMutation,
  useGetAllAccountsQuery,
  useGetAccountByIdQuery,
  useUpdateAccountMutation,

  // Transaction Management
  useAddTransactionMutation,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,

  // Journal Management
  useGetJournalQuery,
  useGetJournalByIdQuery,

  // Ledger Management
  useGetAccountLedgerQuery,

  // Financial Reports
  useGetBalanceSheetQuery,
  useGetIncomeStatementQuery,
  useGetTrialBalanceQuery,

  // Dashboard
  useGetAccountingSummaryQuery,
} = accountingApi; 