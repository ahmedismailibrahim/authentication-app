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

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 403) {
        // Handle token refresh logic here if needed
        // For example, you could attempt to refresh the token and retry the original query
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
        if (refreshResult?.data) {
            // Store the new token and retry the original query
            Cookies.set("accessToken", refreshResult.data.accessToken, { expires: 7 });
            result = await baseQuery(args, api, extraOptions);
        } else {
            // If token refresh fails, you might want to log the user out or handle it accordingly
            Cookies.remove("you need to log in again");
            
        }
    }
    return result;
};



export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});
      