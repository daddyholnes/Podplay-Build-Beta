import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const configApi = createApi({
  reducerPath: 'configApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getStartupConfig: builder.query({
      query: () => 'config/startup',
    }),
  }),
});

export const { useGetStartupConfig } = configApi;
