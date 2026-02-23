//RentAnything/api/chat.service.ts
import { z } from 'zod';
import { apiSlice, validateResponse } from './apiSlice';
import { ChatThreadSchema, ChatMessageSchema, ChatThread, ChatMessage } from '@/types/schemas';

export type { ChatThread, ChatMessage };

export const chatApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUserThreads: builder.query<ChatThread[], void>({
      query: () => 'chat/threads',
      transformResponse: validateResponse(z.array(ChatThreadSchema)),
      providesTags: ['Chat'],
    }),
    getThreadMessages: builder.query<ChatMessage[], number>({
      query: (threadId) => `chat/thread/${threadId}/messages`,
      transformResponse: validateResponse(z.array(ChatMessageSchema)),
      providesTags: (result, error, id) => [{ type: 'Chat', id }],
    }),
    createThread: builder.mutation<ChatThread, { itemId: number; otherUserId: number }>({
      query: (body) => ({
        url: 'chat/thread',
        method: 'POST',
        body,
      }),
      transformResponse: validateResponse(ChatThreadSchema),
      invalidatesTags: ['Chat'],
    }),
    getThreadDetails: builder.query<ChatThread, number>({
      query: (threadId) => `chat/thread/${threadId}`,
      transformResponse: validateResponse(ChatThreadSchema),
      providesTags: (result, error, id) => [{ type: 'Chat', id }],
    }),
  }),
});

export const {
  useGetUserThreadsQuery,
  useGetThreadMessagesQuery,
  useCreateThreadMutation,
  useGetThreadDetailsQuery,
} = chatApi;

export default chatApi;
