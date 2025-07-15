import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { pokemonApi } from "./slices/pokemon";
import { adminApi } from "./slices/admin/surah";
import { blogApi } from "./slices/admin/blog";
import { utilsApi } from "./slices/utils";
import { hadithApi } from "./slices/admin/hadith";
import { donorApi } from "./slices/admin/donor";
import { tafsirApi } from "./slices/admin/tafsir";
import { accountApi } from "./slices/admin/account";
import { commentApi } from "./slices/comment";
import utilityReducer from "./slices/utils/utilitySlice";
import authReducer from "./slices/authslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    utility: utilityReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [utilsApi.reducerPath]: utilsApi.reducer,
    [hadithApi.reducerPath]: hadithApi.reducer,
    [donorApi.reducerPath]: donorApi.reducer,
    [tafsirApi.reducerPath]: tafsirApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(pokemonApi.middleware)
      .concat(adminApi.middleware)
      .concat(blogApi.middleware)
      .concat(utilsApi.middleware)
      .concat(hadithApi.middleware)
      .concat(donorApi.middleware)
      .concat(tafsirApi.middleware)
      .concat(accountApi.middleware)
      .concat(commentApi.middleware),
});

// Optional for better query features like refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);
