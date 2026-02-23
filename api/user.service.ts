//RentAnything/api/user.service.ts
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
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['User'],
    }),
    uploadProfileImage: builder.mutation<{ url: string }, any>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/user/upload-dp',
          method: 'POST',
          body: formData,
        };
      },
      // TransformInterceptor wraps all responses as { data: { url } }
      // so we need to unwrap to get { url } directly
      transformResponse: (response: any) => response?.data ?? response,
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
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
