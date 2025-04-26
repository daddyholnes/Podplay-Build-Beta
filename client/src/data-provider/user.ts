import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getUserBalance: builder.query({
      query: () => 'user/balance',
    }),
  }),
});

export const { useGetUserBalance } = userApi;
