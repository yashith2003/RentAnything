//RentAnything/components/chat/ChatItemMessage.tsx

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGetItemQuery } from '@/api/item.service';
import { getImageUrl } from '@/utils/image';

interface ChatItemMessageProps {
  itemId: number;
  isSender: boolean;
}

export const ChatItemMessage: React.FC<ChatItemMessageProps> = ({ itemId, isSender }) => {
  const router = useRouter();
  const { data: item, isLoading, error } = useGetItemQuery(itemId);

  useEffect(() => {
    if (error) console.error(`[ChatItemMessage] Error fetching item ${itemId}:`, error);
  }, [itemId, error]);

  const containerBaseClass = "w-[250px] h-[90px] rounded-2xl my-1 bg-[#E6F7FA] justify-center";
  const alignmentClass = isSender ? "self-end rounded-br-[4px]" : "self-start rounded-bl-[4px]";

  if (isLoading) {
    return (
      <View className={`${containerBaseClass} ${alignmentClass} items-center border-[0.5px] border-[#36bcd7ff]`}>
        <ActivityIndicator size="small" color="#2FA2B9" />
        <Text className="text-[#2FA2B9] text-xs font-bold mt-1">Loading...</Text>
      </View>
    );
  }

  if (!item) {
    return (
        <View className={`${containerBaseClass} ${alignmentClass} items-center border-[0.5px] border-[#36bcd7ff]`}>
            <Text className="text-[#2FA2B9] text-xs font-bold mt-1">Item Not Found ({itemId})</Text>
        </View>
    );
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      className={`${containerBaseClass} ${alignmentClass} border-[1.5px] border-[#2FA2B9] shadow-sm z-50`}
      onPress={() => router.push(`/item/${itemId}`)}
    >
      <View className="flex-row px-[10px] items-center w-full h-full">
        <View className="w-[70px] h-[70px] bg-white rounded-xl border border-[#BEE7EF] justify-center items-center">
          <Image
            source={{ uri: getImageUrl(item?.imageUrl) }}
            style={{ width: 64, height: 64, borderRadius: 10 }}
            contentFit="cover"
          />
        </View>
        <View className="pl-3 flex-1 h-[70px] justify-evenly">
          <Text className="text-[15px] font-bold text-black" numberOfLines={1}>{item?.title || 'No Title'}</Text>
          <Text className="text-[11px] text-[#444]" numberOfLines={1}>By: {item?.owner?.individualUser?.fullName || item?.owner?.company?.companyName || 'Unknown'}</Text>
          <Text className="text-[13px] text-[#333] font-bold">Rs: {item?.price || item?.pricings?.[0]?.price || '0'}/{item?.pricings?.[0]?.rateType || 'day'}</Text>
          <View className="flex-row items-center">
            <Ionicons name="location-sharp" size={14} color="#2FA2B9" />
            <Text className="text-[10px] text-[#2FA2B9] font-semibold ml-[3px]" numberOfLines={1}>
               {item?.address?.address?.split(',')[0] || 'Malabe'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
