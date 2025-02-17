import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL; // Example: "http://localhost:5000/api/v1"

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (formData) => ({
        url: "auth/register",
        method: "POST",
        body: formData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
    verifyEmail: builder.query({
      query: (token) => `auth/verify-email?token=${token}`,
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyEmailQuery,
} = authApi;
