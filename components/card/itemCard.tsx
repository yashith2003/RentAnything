import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ItemCardProps {
  item: {
    id: number | string;
    image: string;
    price: string;
    extraPrice?: string;
    title: string;
    owner: string;
    rating: string | number;
    distance: string;
    location: string;
    isSaved?: boolean;
    deliveryAvailable?: boolean;
  };
  onPress?: () => void;
}

export default function ItemCard({ item, onPress }: ItemCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/item/${item.id}`);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      className="w-[48%] bg-white rounded-[24px] mb-4 border border-gray-100 overflow-hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className="relative">
        <Image source={{ uri: item.image }} style={{ width: '100%', height: 160 }} contentFit="cover" />
        <TouchableOpacity className="absolute top-3 right-3">
          <Ionicons name={item.isSaved ? "heart" : "heart-outline"} size={20} color={item.isSaved ? "#FF4D4D" : "#000"} />
        </TouchableOpacity>
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
          <Text className="text-gray-400 text-[10px]" numberOfLines={1}>Owner: {item.owner}</Text>
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

        <View className="flex-row items-center mt-3 gap-x-1.5">
          <TouchableOpacity className="flex-1 bg-[#2FA2B9] rounded-xl py-2.5 items-center">
            <Text className="text-white text-[9px] font-bold">Request for rent</Text>
          </TouchableOpacity>
          <View className="flex-row gap-x-1">
            <TouchableOpacity className="w-8 h-8 rounded-full border border-gray-100 items-center justify-center">
                <Ionicons name="call" size={14} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity className="w-8 h-8 rounded-full border border-gray-100 items-center justify-center">
                <Ionicons name="chatbubble-ellipses" size={14} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
