import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { pokemonApi } from "./slices/pokemon";
import { adminApi } from "./slices/admin/surah";
import { blogApi } from "./slices/admin/blog";
import { utilsApi } from "./slices/utils";
import { userDataApi } from "./slices/authslice/userData";
import { hadithApi } from "./slices/admin/hadith";
import { donorApi } from "./slices/admin/donor";
import utilityReducer from "./slices/utils/utilitySlice";
import authReducer from "./slices/authslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    utility: utilityReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [userDataApi.reducerPath]: userDataApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [utilsApi.reducerPath]: utilsApi.reducer,
    [hadithApi.reducerPath]: hadithApi.reducer,
    [donorApi.reducerPath]: donorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(pokemonApi.middleware)
      .concat(adminApi.middleware)
      .concat(userDataApi.middleware)
      .concat(blogApi.middleware)
      .concat(utilsApi.middleware)
      .concat(hadithApi.middleware)
      .concat(donorApi.middleware),
});

// Optional for better query features like refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);
