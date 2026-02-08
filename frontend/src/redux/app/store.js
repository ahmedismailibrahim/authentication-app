import { configureStore } from "@reduxjs/toolkit";
// import userReducer from '../features/user/userSlice';
// import themeReducer from '../features/theme/themeSlice';
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    // user: userReducer,
    // theme: themeReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: import.meta.env.VITE_NODE_ENV !== "production",
});

setupListeners(store.dispatch);
