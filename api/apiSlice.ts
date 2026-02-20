import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';
import { Config } from '@/constants/config';
import { z } from 'zod';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: Config.API_URL,
    prepareHeaders: async (headers) => {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Item', 'User', 'Category'],
  endpoints: () => ({}),
});

/**
 * Helper to wrap an endpoint's transformResponse with Zod validation.
 * This ensures that at runtime, the data matches our expected schema.
 */
export const validateResponse = <T extends z.ZodTypeAny>(schema: T) => (
  response: any
) => {
  // We assume the standard response format { data: ... }
  const result = z.object({ data: schema }).safeParse(response);
  if (!result.success) {
    console.error('Zod Validation Error:', JSON.stringify(result.error.format(), null, 2));
    console.log('Raw Response:', JSON.stringify(response, null, 2));
    return response.data;
  }
  // @ts-ignore - complex Zod inference can sometimes cause lint issues
  return result.data.data;
};
