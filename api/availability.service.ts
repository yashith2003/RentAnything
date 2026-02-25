// api/availability.service.ts

import { apiSlice } from './apiSlice';
import { z } from 'zod';

// Zod schema for a single availability record
export const AvailabilityRecordSchema = z.object({
  id: z.number(),
  availableDate: z.string(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  isAvailable: z.boolean(),
});

export type AvailabilityRecord = z.infer<typeof AvailabilityRecordSchema>;

export const availabilityApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAvailability: builder.query<AvailabilityRecord[], number>({
      query: (itemId) => `/availability/item/${itemId}`,
      transformResponse: (response: any) => {
        const raw = response.data || response;
        const parsed = z.array(AvailabilityRecordSchema).safeParse(raw);
        if (!parsed.success) {
          console.warn('[Availability] Zod validation failed:', parsed.error.format());
          return Array.isArray(raw) ? raw : [];
        }
        return parsed.data;
      },
      providesTags: (result, error, itemId) => [
        { type: 'Item', id: `AVAILABILITY_${itemId}` },
      ],
    }),
  }),
});

export const useGetAvailabilityQuery = availabilityApi.useGetAvailabilityQuery;
