//RentAnything/components/itemDetails/OwnerAbout.tsx

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

interface OwnerAboutProps {
  owner: {
    name: string;
    image: string;
    memberSince: string;
    rating: string;
    listings: string;
  };
  onChat?: () => void;
  isChatLoading?: boolean;
  isChatDisabled?: boolean;
}

export default function OwnerAbout({ owner, onChat, isChatLoading, isChatDisabled }: OwnerAboutProps) {
  const router = useRouter();

  return (
    <View className="mt-8">
      <Text className="text-base font-bold mb-4">About the Owner</Text>
      <View className="flex-row items-center justify-between">
        <TouchableOpacity 
          className="flex-row items-center gap-x-3"
          onPress={() => router.push('/item/ownerProfile')}
        >
          <Image source={{ uri: owner.image }} style={{ width: 45, height: 45, borderRadius: 25 }} />
          <View>
            <View className="flex-row items-center gap-x-1">
              <Text className="font-bold text-sm">{owner.name}</Text>
              <Ionicons name="checkmark-circle" size={14} color="#3B82F6" />
            </View>
            <Text className="text-gray-400 text-[10px]">Member since {owner.memberSince}</Text>
            <View className="flex-row items-center mt-0.5">
              <Ionicons name="star" size={10} color="#FFD700" />
              <Text className="text-[10px] font-bold ml-1">{owner.rating}</Text>
              <View className="mx-1 w-1 h-1 bg-gray-300 rounded-full" />
              <Text className="text-[10px] text-gray-400">{owner.listings} Listings</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View className="flex-row items-center gap-x-2">
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100">
            <Ionicons name="call-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-10 h-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100 ${isChatDisabled ? 'opacity-50' : ''}`}
            onPress={onChat}
            disabled={isChatLoading || isChatDisabled}
          >
            {isChatLoading ? (
                <ActivityIndicator size="small" color="#2FA2B9" />
            ) : (
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={isChatDisabled ? "#9CA3AF" : "#6B7280"} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-gray-400 text-xs mt-4 leading-5">
        Find reliable space sharing around Sri Lanka, book, or offer your equipment for rent locally. Browse years of experience, vehicle status, and start your rental journey with confidence.
      </Text>
    </View>
  );
}
