import { apiSlice } from './apiSlice';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  name: string;
  image: string;
  createdAt: string;
  itemName?: string;
  reviewerStatus?: string;
}

export interface ReviewsResponse {
  totalReviews: number;
  averageRating: number;
  reviews: Review[];
}

export interface SubmitReviewRequest {
  itemId: number;
  rating: number;
  feedback?: string;
}

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItemReviews: builder.query<ReviewsResponse, { itemId: number; page?: number; limit?: number }>({
      query: ({ itemId, page = 1, limit = 10 }) => `reviews/item/${itemId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, arg) => [{ type: 'ItemReviews', id: arg.itemId }],
    }),
    getUserReviews: builder.query<ReviewsResponse, { userId: number; page?: number; limit?: number }>({
      query: ({ userId, page = 1, limit = 10 }) => `reviews/user/${userId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, arg) => [{ type: 'UserReviews', id: arg.userId }],
    }),
    submitReview: builder.mutation<Review, SubmitReviewRequest>({
      query: (body) => ({
        url: 'reviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ItemReviews', id: arg.itemId },
        { type: 'UserReviews' }, 
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetItemReviewsQuery,
  useGetUserReviewsQuery,
  useSubmitReviewMutation,
} = reviewApi;
