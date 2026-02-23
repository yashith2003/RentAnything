//RentAnything/api/kyc.service.ts
import { apiSlice, validateResponse } from './apiSlice';
import { KycStatusResponseSchema, KycStatusResponse, KycDocumentType } from '@/types/schemas';

export const kycApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getKycStatus: builder.query<KycStatusResponse, void>({
      query: () => 'kyc/status',
      transformResponse: validateResponse(KycStatusResponseSchema),
      providesTags: ['Chat'], // Reusing Chat tag for now or add a new one in apiSlice
    }),
    uploadKycDocument: builder.mutation<any, { type: KycDocumentType; file: any }>({
      query: ({ type, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `kyc/upload/${type}`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Chat'],
    }),
    getKycDocument: builder.query<any, KycDocumentType>({
      query: (type) => `kyc/document/${type}`,
      providesTags: (result, error, type) => [{ type: 'Chat', id: type }],
    }),
  }),
});

export const {
  useGetKycStatusQuery,
  useUploadKycDocumentMutation,
  useGetKycDocumentQuery,
} = kycApi;

export default kycApi;
