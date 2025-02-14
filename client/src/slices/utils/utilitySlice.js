import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpenSidebar: false, // Default state: Sidebar is closed
};

const utilitySlice = createSlice({
  name: "utility",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpenSidebar = !state.isOpenSidebar;
    },
    openSidebar: (state) => {
      state.isOpenSidebar = true;
    },
    closeSidebar: (state) => {
      state.isOpenSidebar = false;
    },
  },
});

export const { toggleSidebar, openSidebar, closeSidebar } = utilitySlice.actions;

export default utilitySlice.reducer;
