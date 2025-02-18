import { createSlice } from "@reduxjs/toolkit";
import { Cookie } from "lucide-react";

// Helper functions for localStorage
const saveToLocalStorage = (state) => {
  localStorage.setItem("user", JSON.stringify(state));
  Cookie.set("user", JSON.stringify(state));
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
      state.isAusaveToLocalStoragethenticated = true;
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
