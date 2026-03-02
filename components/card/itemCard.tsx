//RentAnything/components/card/itemCard.tsx

import { SavedItem, useSavedItems } from '@/context/SavedItemsContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View, Linking } from 'react-native';
import { getImageUrl } from '@/utils/image';
import { useCreateThreadMutation, useGetUserThreadsQuery } from '@/api/chat.service';
import { useRecordInteractionMutation } from '@/api/item.service';
import { useUser } from '@/context/userContext';

interface ItemCardProps {
  item: {
    id: number | string;
    image: string | null | undefined;
    price: string;
    extraPrice?: string;
    title: string;
    owner: string;
    ownerId?: number | string;
    phone?: string;
    rating: string | number;
    distance: string;
    location: string;
    isSaved?: boolean;
    deliveryAvailable?: boolean;
    delivery?: boolean;
  };
  onPress?: () => void;
}

export default function ItemCard({ item, onPress }: ItemCardProps) {
  const router = useRouter();
  const { role } = useUser();
  const isGuest = role?.toLowerCase() === 'guest';
  const { isSaved, toggleItem } = useSavedItems();
  const saved = isSaved(Number(item.id));

  const [createThread] = useCreateThreadMutation();
  const { data: threads } = useGetUserThreadsQuery();
  const [recordInteraction] = useRecordInteractionMutation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/item/${item.id}`);
    }
  };

  const handleSave = async () => {
    await toggleItem(Number(item.id));
  };

  const handleCall = () => {
    if (item.phone) {
      recordInteraction({ itemId: Number(item.id), type: 'CALL' });
      Linking.openURL(`tel:${item.phone}`);
    } else {
      console.warn('[ItemCard] Cannot call, missing phone number');
    }
  };

  const handleChat = async () => {
    try {
      recordInteraction({ itemId: Number(item.id), type: 'CHAT' });
      const otherUserId = item.ownerId || (item as any).owner?.id;

      if (!otherUserId) {
        console.warn('[ItemCard] Cannot start chat, missing ownerId/otherUserId');
        return;
      }

      const itemIdNum = Number(item.id);
      const existingThread = Array.isArray(threads) ? threads.find(t => Number(t.itemId) === itemIdNum) : undefined;
      
      if (existingThread) {
        router.push({ pathname: '/chat/chatDetails', params: { threadId: existingThread.id } } as any);
        return;
      }

      const result = await createThread({
        itemId: itemIdNum,
        otherUserId: Number(otherUserId),
      }).unwrap();
      
      if (result?.id) {
        router.push({ pathname: '/chat/chatDetails', params: { threadId: result.id } } as any);
      }
    } catch (err) {
      console.error('[ItemCard] handleChat error:', err);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      className="w-full bg-white rounded-[24px] mb-4 border border-gray-100 overflow-hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className="relative">
        <Image 
          source={{ uri: getImageUrl(item.image) }} 
          style={{ width: '100%', height: 160 }} 
          contentFit="cover"
          placeholder="https://via.placeholder.com/400?text=Loading..."
          transition={200}
        />
        {!isGuest && (
          <TouchableOpacity 
              className="absolute top-3 right-3"
              onPress={handleSave}
          >
            <Ionicons name={saved ? "heart" : "heart-outline"} size={22} color={saved ? "#FF0000" : "#000"} />
          </TouchableOpacity>
        )}
      </View>

      <View className="p-3">
        <View className="flex-row flex-wrap items-baseline">
          <Text className="text-[#2FA2B9] font-bold text-xs">{item.price}</Text>
          {item.extraPrice && <Text className="text-gray-400 text-[9px] ml-0.5">{item.extraPrice}</Text>}
        </View>

        <Text className="font-bold text-sm mt-1 text-[#0B0C15]" numberOfLines={1}>
          {item.title}
        </Text>

        <View className="flex-row items-center mt-1">
          <Text className="text-gray-400 text-[10px]" numberOfLines={1}>Owner: {typeof item.owner === 'string' ? item.owner : 'N/A'}</Text>
          <View className="ml-1 w-3 h-3 bg-[#2D8CFF] rounded-full items-center justify-center">
            <Ionicons name="checkmark" size={8} color="white" />
          </View>
        </View>

        <View className="flex-row items-center mt-1">
            <Text className="text-gray-500 font-bold text-[10px] mr-1">{item.rating}</Text>
            <Ionicons name="star" size={12} color="#FFCC00" />
        </View>
        
        <View className="flex-row items-center mt-0.5">
          <Ionicons name="location-outline" size={12} color="#2FA2B9" />
          <Text className="text-[#2FA2B9] text-[10px] font-medium ml-1">
            {item.distance} - {item.location}
          </Text>
        </View>

        <View className="flex-row items-center mt-3 gap-x-2">
          <TouchableOpacity 
            onPress={handleCall}
            className="flex-1 bg-[#2FA2B9] rounded-xl py-2.5 items-center flex-row justify-center gap-x-1"
          >
            <Ionicons name="call" size={12} color="white" />
            <Text className="text-white text-[10px] font-bold">Contact</Text>
          </TouchableOpacity>
          
          {!isGuest && (
            <TouchableOpacity
              className="w-9 h-9 rounded-full border border-gray-100 items-center justify-center"
              onPress={handleChat}
            >
              <Ionicons name="chatbubble-ellipses" size={16} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Delivery Info */}
        <View className="flex-row items-center mt-2.5">
          <Ionicons 
            name={item.deliveryAvailable ? "bicycle" : "bicycle-outline"} 
            size={14} 
            color="#9ca3af" 
          />
          <Text className="text-gray-400 text-[9px] font-medium ml-1.5">
            {item.deliveryAvailable ? 'Delivery Available' : 'Pickup Only'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
