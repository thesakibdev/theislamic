import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { pokemonApi } from "./slices/pokemon";
import { authApi } from "./slices/authslice";
import { adminApi } from "./slices/admin/surah";
import { blogApi } from "./slices/admin/blog";
import userReducer from "./slices/authslice/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(pokemonApi.middleware)
      .concat(authApi.middleware)
      .concat(adminApi.middleware)
      .concat(blogApi.middleware),
});

// Optional for better query features like refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);
