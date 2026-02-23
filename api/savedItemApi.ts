//RentAnything/api/savedItemApi.ts

import { apiSlice } from './apiSlice';

export const savedItemApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSavedItems: builder.query<any[], void>({
      query: () => {
        console.log('[SavedItemApi] Fetching saved items...');
        return 'items/saved';
      },
      // TransformInterceptor wraps all responses as { data: [...] } — unwrap it
      transformResponse: (response: any) => {
        const items = response?.data ?? response;
        console.log('[SavedItemApi] getSavedItems raw response:', JSON.stringify(response).slice(0, 200));
        console.log('[SavedItemApi] getSavedItems unwrapped count:', Array.isArray(items) ? items.length : 'NOT AN ARRAY');
        return Array.isArray(items) ? items : [];
      },
      providesTags: ['SavedItem'],
    }),
    toggleSaveItem: builder.mutation<{ saved: boolean }, number>({
      query: (itemId) => {
        console.log(`[SavedItemApi] Toggling save for item ${itemId}`);
        return {
          url: `items/saved/${itemId}/toggle`,
          method: 'POST',
        };
      },
      // Unwrap TransformInterceptor wrapper
      transformResponse: (response: any) => {
        const result = response?.data ?? response;
        console.log('[SavedItemApi] toggleSave response:', result);
        return result;
      },
      invalidatesTags: ['SavedItem'],
    }),
    checkIsSaved: builder.query<boolean, number>({
      query: (itemId) => `items/saved/${itemId}/check`,
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (result, error, arg) => [{ type: 'SavedItem', id: arg }],
    }),
  }),
});

export const {
  useGetSavedItemsQuery,
  useToggleSaveItemMutation,
  useCheckIsSavedQuery,
} = savedItemApi;
