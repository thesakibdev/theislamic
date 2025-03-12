import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define the base API
export const userDataApi = createApi({
  reducerPath: "userDataApi", // Unique key for this API slice
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: ({ id }) => (
        console.log(id),
        {
          url: `/auth/get/user-details/${id}`,
          method: "GET",
        }
      ),
      providesTags: ["User"],
    }),
  }),
});

// Export the auto-generated hook
export const { useGetUserDetailsQuery } = userDataApi;
