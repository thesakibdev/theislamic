// Fix for authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  userDetails: null,
  error: null,
  authChecked: false, // Add this flag to track if auth has been checked
};

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.error?.message || "Something went wrong";

  // On auth check rejection, mark as checked but don't reset user
  if (action.type === checkAuth.rejected.type) {
    state.authChecked = true;
  }
};

const handleAuthFulfilled = (state, action) => {
  state.isLoading = false;
  state.user = action.payload.success ? action.payload.user : null;
  state.isAuthenticated = action.payload.success;
  state.error = null;

  // For auth check, mark it as checked
  if (action.type === checkAuth.fulfilled.type) {
    state.authChecked = true;
  }
};

const createAsyncAction = (type, request) => {
  return createAsyncThunk(type, async (args, { rejectWithValue }) => {
    try {
      const response = await request(args);
      return response.data;
    } catch (error) {
      // Handle 401 errors by not rejecting but returning a standardized response
      if (error.response?.status === 401 && type === "auth/checkAuth") {
        return { success: false, user: null };
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  });
};

export const registerUser = createAsyncAction("auth/register", (formData) =>
  axios.post(`${baseUrl}/auth/register`, formData, { withCredentials: true })
);

export const loginUser = createAsyncAction("auth/login", (formData) =>
  axios.post(`${baseUrl}/auth/login`, formData, { withCredentials: true })
);

export const logoutUser = createAsyncAction("auth/logout", () =>
  axios.post(`${baseUrl}/auth/logout`, {}, { withCredentials: true })
);

export const checkAuth = createAsyncAction("auth/checkAuth", () =>
  axios.get(`${baseUrl}/auth/check-auth`, {
    withCredentials: true,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  })
);

export const getUserDetails = createAsyncAction("auth/getUserDetails", (id) =>
  axios.get(`${baseUrl}/auth/get/user-details/${id}`, { withCredentials: true })
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
    resetAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.authChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, handleRejected)
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleAuthFulfilled)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(checkAuth.pending, handlePending)
      .addCase(checkAuth.fulfilled, handleAuthFulfilled)
      .addCase(checkAuth.rejected, handleRejected)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })
      .addCase(getUserDetails.pending, handlePending)
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload.userDetails;
        state.error = null;
      })
      .addCase(getUserDetails.rejected, handleRejected);
  },
});

export const { setUser, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
