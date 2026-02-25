//RentAnything/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';
import { Config } from '@/constants/config';
import { z } from 'zod';

// Global variable to hold token synchronously for RTK Query
let currentToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  currentToken = token;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: Config.API_URL,
    prepareHeaders: (headers) => {
      // Synchronous token retrieval (fixes the async prepareHeaders 401 bug)
      if (currentToken) {
        headers.set('Authorization', `Bearer ${currentToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Item', 'User', 'Category', 'Chat', 'SavedItem', 'ItemReviews', 'UserReviews'],
  endpoints: () => ({}),
});

/**
 * Helper to wrap an endpoint's transformResponse with Zod validation.
 * This ensures that at runtime, the data matches our expected schema.
 */
export const validateResponse = <T extends z.ZodTypeAny>(schema: T) => (
  response: any
) => {
  if (!response) {
     console.warn('validateResponse: Received empty response');
     return null;
  }
  
  // If the response is already validated or doesn't have a data wrapper, check if it matches schema
  if (response.data === undefined) {
      const directResult = schema.safeParse(response);
      if (directResult.success) return directResult.data;
      return response;
  }

  const result = z.object({ data: schema }).safeParse(response);
  if (!result.success) {
    console.error('Zod Validation Error:', JSON.stringify(result.error.format(), null, 2));
    // Fallback to data property if validation fails but property exists
    return response.data;
  }
  // @ts-ignore
  return result.data.data;
};
