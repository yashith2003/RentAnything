// components/incidentCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

export interface Incident {
  id: string;
  itemName: string;
  itemDescription: string;
  itemCondition: string;
  itemImage: string;
  user: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  bookingDate: string;
  duration: string;
  price: string;
  incidentType: string;
  evidenceImages: string[];
  evidenceVideo: string;
  description: string;
}

interface IncidentCardProps {
  item: Incident;
}

export default function IncidentCard({ item }: IncidentCardProps) {
  return (
    <View
      className="mb-6 p-4 border border-gray-100 rounded-[32px] bg-white shadow-sm"
      style={{ elevation: 1 }}
    >
      {/* Item Header */}
      <View className="flex-row gap-3 mb-4">
        <Image
          source={{ uri: item.itemImage }}
          style={{ width: 120, height: 80, borderRadius: 12 }}
          contentFit="cover"
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text className="text-base font-bold text-black mb-1">{item.itemName}</Text>
          </View>
          <Text className="text-xs text-gray-400 leading-4 mb-2" numberOfLines={3}>
            {item.itemDescription}
          </Text>
          <Text className="text-xs text-gray-400">{item.itemCondition}</Text>
        </View>
      </View>

      {/* User Info */}
      <View className="flex-row items-center gap-2 mb-4">
        <Image
          source={{ uri: item.user.avatar }}
          style={{ width: 32, height: 32, borderRadius: 16 }}
          contentFit="cover"
        />
        <Text className="text-sm font-bold text-black">{item.user.name}</Text>
        {item.user.isVerified && (
          <Ionicons name="checkmark-circle" size={18} color="#2196F3" />
        )}
      </View>

      {/* Details Grid */}
      <View className="mb-4">
        <Text className="text-xs text-black mb-1">
          <Text className="font-bold">Booking: </Text>
          <Text className="text-gray-500">{item.bookingDate}</Text>
        </Text>
        <Text className="text-xs text-black mb-1">
          <Text className="font-bold">{item.duration} | </Text>
          <Text className="font-bold text-[#2FA2B9]">{item.price}</Text>
        </Text>
        <Text className="text-xs text-black mb-1">
          <Text className="font-bold">Incident Type: </Text>
          <Text className="text-gray-500">{item.incidentType}</Text>
        </Text>
      </View>

      {/* Evidence Images */}
      <Text className="text-sm font-bold text-black mb-2">Images</Text>
      <View className="flex-row gap-2 mb-4">
        {item.evidenceImages.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: img }}
            style={{ width: 85, height: 65, borderRadius: 8 }}
            contentFit="cover"
          />
        ))}
      </View>

      {/* Evidence Video */}
      <Text className="text-sm font-bold text-black mb-2">Video</Text>
      <View className="w-full h-44 rounded-2xl overflow-hidden mb-4 bg-gray-100">
        <Image
          source={{ uri: item.evidenceVideo }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
        {/* Play Button Overlay */}
        <View className="absolute inset-0 items-center justify-center bg-black/10">
          <View className="w-12 h-12 rounded-full bg-white/40 items-center justify-center">
            <Ionicons name="play" size={24} color="white" style={{ marginLeft: 3 }} />
          </View>
        </View>
      </View>

      {/* Description */}
      <Text className="text-sm text-gray-500 leading-5">
        <Text className="font-bold text-black">Description: </Text>
        {item.description}
      </Text>
    </View>
  );
}
