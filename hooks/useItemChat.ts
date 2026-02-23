import { useRouter } from 'expo-router';
import { useCreateThreadMutation, useGetUserThreadsQuery } from '@/api/chat.service';
import { useGetProfileQuery } from '@/api/user.service';
import { Alert } from 'react-native';

export const useItemChat = (item: any) => {
  const router = useRouter();
  const { data: profile } = useGetProfileQuery();
  const { data: threads } = useGetUserThreadsQuery();
  const [createThread, { isLoading: isCreatingThread }] = useCreateThreadMutation();

  const isOwnListing = profile?.id === item?.owner?.id;

  const handleChat = async () => {
    try {
      if (!item) return;
      const otherUserId = item.ownerId || item.owner?.id;

      if (!otherUserId) {
        console.warn('[useItemChat] Missing otherUserId');
        return;
      }

      if (isOwnListing) {
        Alert.alert("Notice", "You cannot chat with yourself about your own listing.");
        return;
      }

      const itemIdNum = Number(item.id);
      const existingThread = Array.isArray(threads) ? threads.find(t => Number(t.itemId) === itemIdNum) : undefined;
      
      if (existingThread) {
        router.push({ pathname: '/header/chat/chatDetails', params: { threadId: existingThread.id } } as any);
        return;
      }

      const newThread = await createThread({ 
        itemId: itemIdNum, 
        otherUserId: Number(otherUserId)
      }).unwrap();
      
      if (newThread?.id) {
        router.push({ pathname: '/header/chat/chatDetails', params: { threadId: newThread.id } } as any);
      }
    } catch (err) {
      console.error('[useItemChat] handleChat error:', err);
      Alert.alert("Chat Error", "Unable to start conversation. Please try again.");
    }
  };

  return {
    handleChat,
    isCreatingThread,
    isOwnListing
  };
};
