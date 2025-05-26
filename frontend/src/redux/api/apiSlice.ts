import {fetchBaseQuery, createApi} from '@reduxjs/toolkit/query/react';

const BASE_URL = '';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({
  }),
  tagTypes: ['User'],
});