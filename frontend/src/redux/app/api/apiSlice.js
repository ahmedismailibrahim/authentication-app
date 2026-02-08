import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

 const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL || "http://localhost:5000",
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = Cookies.get("accessToken");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        console.log(token);
        return headers;
    },
});


export const apiSlice = createApi({
    baseQuery: baseQuery,
    endpoints: () => ({}),
});
      