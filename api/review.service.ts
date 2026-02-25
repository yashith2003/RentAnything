import { apiSlice, validateResponse } from './apiSlice';
import { Review, ReviewsResponse, ReviewsResponseSchema, ReviewSchema } from '../types/schemas';

export interface SubmitReviewRequest {
  itemId: number;
  rating: number;
  feedback?: string;
}

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItemReviews: builder.query<ReviewsResponse, { itemId: number; page?: number; limit?: number }>({
      query: ({ itemId, page = 1, limit = 10 }) => `reviews/item/${itemId}?page=${page}&limit=${limit}`,
      transformResponse: validateResponse(ReviewsResponseSchema),
      providesTags: (result, error, arg) => [{ type: 'ItemReviews', id: arg.itemId }],
    }),
    getUserReviews: builder.query<ReviewsResponse, { userId: number; page?: number; limit?: number }>({
      query: ({ userId, page = 1, limit = 10 }) => `reviews/user/${userId}?page=${page}&limit=${limit}`,
      transformResponse: validateResponse(ReviewsResponseSchema),
      providesTags: (result, error, arg) => [{ type: 'UserReviews', id: arg.userId }],
    }),
    submitReview: builder.mutation<Review & { ownerId?: number }, SubmitReviewRequest>({
      query: (body) => ({
        url: 'reviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ItemReviews', id: arg.itemId },
        { type: 'UserReviews', id: result?.ownerId }, 
        { type: 'ItemReviews', id: 'MY_REVIEW_' + arg.itemId },
      ],
    }),
    getMyReviewForItem: builder.query<{ rating: number; comment?: string } | null, number>({
      query: (itemId) => `reviews/item/${itemId}/my-review`,
      providesTags: (result, error, itemId) => [{ type: 'ItemReviews', id: 'MY_REVIEW_' + itemId }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetItemReviewsQuery,
  useGetUserReviewsQuery,
  useSubmitReviewMutation,
  useGetMyReviewForItemQuery,
} = reviewApi;
