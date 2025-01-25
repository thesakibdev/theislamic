import { createSlice } from "@reduxjs/toolkit";

// Helper functions for localStorage
const saveToLocalStorage = (state) => {
  localStorage.setItem("user", JSON.stringify(state));
};

const loadFromLocalStorage = () => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : { isAuthenticated: false, user: null };
};

// Initialize state from localStorage
const initialState = loadFromLocalStorage();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      saveToLocalStorage(state);
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      saveToLocalStorage(state);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
