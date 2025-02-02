import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { pokemonApi } from "./slices/pokemon";
import { authApi } from "./slices/authslice";
import { adminApi } from "./slices/admin/surah";
import userReducer from "./slices/authslice/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(pokemonApi.middleware)
      .concat(authApi.middleware)
      .concat(adminApi.middleware),
});

// Optional for better query features like refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);
