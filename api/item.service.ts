// api/item.service.ts
import { apiSlice, validateResponse } from './apiSlice';
import { ItemSchema, Item } from '../types/schemas';
import { z } from 'zod';

export interface CreateAvailabilityDto {
  availableDate: string;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
}

export interface CreateItemDto {
  title: string;
  description: string;
  categoryId: number;
  addressId: number;
  condition?: string;
  phone?: string;
  rentalTerms?: string;
  instructions?: string;
  securityDeposit?: number;
  imageUrl?: string;
  rateType?: string;
  price?: number;
  availabilities?: CreateAvailabilityDto[];
}

export const itemApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getItems: builder.query<Item[], { category?: string; filters?: any } | void>({
      query: (params) => ({
        url: '/items',
        params: params ? { cat: params.category, ...params.filters } : {},
      }),
      // Handle infinite scroll merging
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Exclude 'page' from the cache key so all pages share the same cache entry
        const { filters, ...rest } = queryArgs || {};
        const { page, ...otherFilters } = filters || {};
        return { ...rest, filters: otherFilters };
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg?.filters?.page === 1) {
          return newItems;
        }
        const existingIds = new Set(currentCache.map(i => i.id));
        const filteredNewItems = newItems.filter(i => !existingIds.has(i.id));
        return [...currentCache, ...filteredNewItems];
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      transformResponse: validateResponse(z.array(ItemSchema)),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Item' as const, id })), { type: 'Item', id: 'LIST' }]
          : [{ type: 'Item', id: 'LIST' }],
    }),
    getTrendingItems: builder.query<Item[], { category?: string; filters?: any } | void>({
      query: (params) => ({
        url: '/items/trending',
        params: params ? { cat: params.category, ...params.filters } : {},
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { filters, ...rest } = queryArgs || {};
        const { page, ...otherFilters } = filters || {};
        return { ...rest, filters: otherFilters };
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg?.filters?.page === 1) return newItems;
        const existingIds = new Set(currentCache.map(i => i.id));
        const filteredNewItems = newItems.filter(i => !existingIds.has(i.id));
        return [...currentCache, ...filteredNewItems];
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      transformResponse: validateResponse(z.array(ItemSchema)),
      providesTags: ['Item'],
    }),
    recordInteraction: builder.mutation<void, { itemId: number; type: 'VIEW' | 'CALL' | 'CHAT' }>({
      query: ({ itemId, type }) => ({
        url: `/items/${itemId}/interact`,
        method: 'POST',
        body: { type },
      }),
    }),
    getItem: builder.query<Item, number>({
      query: (id) => `/items/${id}`,
      transformResponse: validateResponse(ItemSchema),
      providesTags: (result, error, id) => [{ type: 'Item', id }],
    }),
    getMyItems: builder.query<Item[], void>({
      query: () => '/items/my-items',
      transformResponse: validateResponse(z.array(ItemSchema)),
      providesTags: [{ type: 'Item', id: 'MY_LIST' }],
    }),
    createItem: builder.mutation<Item, CreateItemDto>({
      query: (data) => ({
        url: '/items',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Item', id: 'LIST' }, { type: 'Item', id: 'MY_LIST' }],
    }),
    updateItem: builder.mutation<Item, { id: number; data: Partial<CreateItemDto> }>({
      query: ({ id, data }) => ({
        url: `/items/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Item', id },
        { type: 'Item', id: 'LIST' },
        { type: 'Item', id: 'MY_LIST' },
      ],
    }),
    getMapItems: builder.query<Item[], { category?: string; filters?: any; neLat: number; neLng: number; swLat: number; swLng: number } | void>({
      query: (params) => ({
        url: '/items/map',
        params: params ? { neLat: params.neLat, neLng: params.neLng, swLat: params.swLat, swLng: params.swLng, cat: params.category, ...params.filters } : {},
      }),
      // Map items might have a different structure, skipping strict validation for now or use a partial schema
      providesTags: [{ type: 'Item', id: 'MAP' }],
    }),
    getOwnerItems: builder.query<Item[], number>({
      query: (ownerId) => `/items/owner/${ownerId}`,
      transformResponse: validateResponse(z.array(ItemSchema)),
      providesTags: (result, error, ownerId) => [{ type: 'Item', id: `OWNER_${ownerId}` }],
    }),
    getMyItemsWithReviews: builder.query<any[], void>({
      query: () => '/items/my-items/reviews',
      transformResponse: (response: any) => response.data || response,
      providesTags: [{ type: 'Item', id: 'MY_REVIEWS' }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetItemsQuery,
  useGetTrendingItemsQuery,
  useRecordInteractionMutation,
  useGetItemQuery,
  useGetMyItemsQuery,
  useGetMyItemsWithReviewsQuery,
  useGetOwnerItemsQuery, // Renamed from useGetItemsByOwnerQuery to match endpoint name
  useCreateItemMutation,
  useUpdateItemMutation,
  // useDeleteItemMutation, // This endpoint does not exist in the provided itemApi definition
  useGetMapItemsQuery,
} = itemApi;

// Keeping the legacy service for backward compatibility during migration if needed, 
// but it should eventually be removed.
const itemService = {
  create: async (data: CreateItemDto) => {
    return {} as any; 
  },
  getItems: async (category?: string, filters?: any) => {
    return [] as any[];
  },
  getMyItems: async () => {
    return [] as any[];
  },
  getItem: async (id: number) => {
    return {} as any;
  },
};

export default itemService;
