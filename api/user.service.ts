// api/user.service.ts
import { apiSlice, validateResponse } from './apiSlice';
import { UserProfileSchema, UserProfile } from '../types/schemas';

export const userApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => '/user/profile',
      transformResponse: validateResponse(UserProfileSchema),
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (data) => ({
        url: '/user/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
} = userApi;

// Legacy support
export const userService = {
  getProfile: async () => {
    return {} as UserProfile;
  },
  updateProfile: async (data: Partial<UserProfile>) => {
    return {} as UserProfile;
  }
};
