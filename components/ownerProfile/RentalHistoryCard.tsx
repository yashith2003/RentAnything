import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

interface RentalHistoryItem {
  id: number;
  title: string;
  owner: string;
  period: string;
  ended: string;
  location: string;
  image: string;
}

interface RentalHistoryCardProps {
  item: RentalHistoryItem;
}

export default function RentalHistoryCard({ item }: RentalHistoryCardProps) {
  return (
    <View className="bg-white border border-gray-100 rounded-3xl p-3 mb-4 shadow-sm flex-row gap-x-4">
      <Image source={{ uri: item.image }} style={{ width: 100, height: 80, borderRadius: 20 }} />
      <View className="flex-1 justify-center">
        <Text className="font-bold text-sm">{item.title}</Text>
        <Text className="text-gray-400 text-[10px] mt-0.5">{item.owner}</Text>
        <Text className="text-gray-400 text-[10px] mt-1">{item.period}</Text>
        <Text className="text-gray-800 text-[10px] font-bold mt-0.5">{item.ended}</Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={12} color="#2FA2B9" />
          <Text className="text-[#2FA2B9] text-[9px] font-medium ml-1">{item.location}</Text>
        </View>
      </View>
    </View>
  );
}
