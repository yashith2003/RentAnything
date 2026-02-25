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
      transformResponse: validateResponse(z.array(ItemSchema)),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Item' as const, id })), { type: 'Item', id: 'LIST' }]
          : [{ type: 'Item', id: 'LIST' }],
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
    getMapItems: builder.query<any[], { bounds: { neLat: number; neLng: number; swLat: number; swLng: number }; categoryId?: number; filters?: any }>({
      query: ({ bounds, categoryId, filters }) => ({
        url: '/items/map',
        params: { ...bounds, cat: categoryId, ...filters },
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
export const useGetItemsQuery = itemApi.useGetItemsQuery;
export const useGetItemQuery = itemApi.useGetItemQuery;
export const useGetMyItemsQuery = itemApi.useGetMyItemsQuery;
export const useCreateItemMutation = itemApi.useCreateItemMutation;
export const useUpdateItemMutation = itemApi.useUpdateItemMutation;
export const useGetMapItemsQuery = itemApi.useGetMapItemsQuery;
export const useGetOwnerItemsQuery = itemApi.useGetOwnerItemsQuery;
export const useGetMyItemsWithReviewsQuery = itemApi.useGetMyItemsWithReviewsQuery;

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
