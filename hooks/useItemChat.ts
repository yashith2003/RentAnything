import { useRouter } from 'expo-router';
import { useCreateThreadMutation, useGetUserThreadsQuery } from '@/api/chat.service';
import { useRecordInteractionMutation } from '@/api/item.service';
import { useGetProfileQuery } from '@/api/user.service';
import { useState } from 'react';

export const useItemChat = (item: any) => {
  const router = useRouter();
  const { data: profile } = useGetProfileQuery();
  const { data: threads } = useGetUserThreadsQuery();
  const [createThread, { isLoading: isCreatingThread }] = useCreateThreadMutation();
  const [recordInteraction] = useRecordInteractionMutation();
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [notice, setNotice] = useState<{ title: string; message: string } | null>(null);

  const clearMessages = () => {
    setError(null);
    setNotice(null);
  };

  const isOwnListing = profile?.id === item?.owner?.id;

  const handleChat = async () => {
    try {
      if (!item) return;
      recordInteraction({ itemId: Number(item.id), type: 'CHAT' });
      const otherUserId = item.ownerId || item.owner?.id;

      if (!otherUserId) {
        console.warn('[useItemChat] Missing otherUserId');
        return;
      }

      if (isOwnListing) {
        setNotice({
          title: "Notice",
          message: "You cannot chat with yourself about your own listing."
        });
        return;
      }

      const itemIdNum = Number(item.id);
      const existingThread = Array.isArray(threads) ? threads.find(t => Number(t.itemId) === itemIdNum) : undefined;
      
      if (existingThread) {
        router.push({ pathname: '/chat/chatDetails', params: { threadId: existingThread.id } } as any);
        return;
      }

      const newThread = await createThread({ 
        itemId: itemIdNum, 
        otherUserId: Number(otherUserId)
      }).unwrap();
      
      if (newThread?.id) {
        router.push({ pathname: '/chat/chatDetails', params: { threadId: newThread.id } } as any);
      }
    } catch (err) {
      console.error('[useItemChat] handleChat error:', err);
      setError({
        title: "Chat Error",
        message: "Unable to start conversation. Please try again."
      });
    }
  };

  return {
    handleChat,
    isCreatingThread,
    isOwnListing,
    error,
    notice,
    clearMessages
  };
};
