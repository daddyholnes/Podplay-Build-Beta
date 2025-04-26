/**
 * Model endpoint types
 */
export enum EModelEndpoint {
  azureOpenAI = 'azureOpenAI',
  openAI = 'openAI',
  bingAI = 'bingAI',
  chatGPTBrowser = 'chatGPTBrowser',
  google = 'google',
  gptPlugins = 'gptPlugins',
  anthropic = 'anthropic',
  custom = 'custom',
}

/**
 * Assistant endpoint types
 */
export enum EAssisstantEndpoint {
  assistant = 'assistant',
}

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const endpointsApi = createApi({
  reducerPath: 'endpointsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getEndpoints: builder.query({
      query: () => 'endpoints',
    }),
  }),
});

export const { useGetEndpointsQuery } = endpointsApi;