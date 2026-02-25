// components/itemDetails/CategoryItemCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { getImageUrl } from '@/utils/image';
import { Item } from '@/types/schemas';

const itemImagesFallback = [
  'https://via.placeholder.com/300x200?text=No+Image',
];

interface Props {
  item: Item;
}

export default function CategoryItemCard({ item }: Props) {
  const router = useRouter();

  const ownerName =
    item.owner?.individualUser?.fullName ||
    item.owner?.company?.companyName ||
    'Owner';

  const pricing = item.pricings?.[0];
  const price = pricing ? `Rs: ${pricing.price} / ${pricing.rateType}` : 'Price N/A';

  return (
    <TouchableOpacity
      onPress={() => router.push(`/item/${item.id}` as any)}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 w-52 mr-3"
      style={{ elevation: 2 }}
      activeOpacity={0.85}
    >
      {/* Image */}
      <Image
        source={{ uri: getImageUrl(item.imageUrl) || itemImagesFallback[0] }}
        style={{ width: '100%', height: 110 }}
        contentFit="cover"
      />

      <View className="p-3">
        {/* Price */}
        <Text className="text-cyan-600 text-xs font-bold" numberOfLines={1}>
          {price}
        </Text>

        {/* Title */}
        <Text className="font-bold text-sm mt-1" numberOfLines={1}>
          {item.title}
        </Text>

        {/* Owner */}
        <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
          {ownerName}
        </Text>

        {/* Rating */}
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={11} color="#FFD700" />
          <Text className="ml-1 text-xs text-gray-600">
            {item.averageRating?.toFixed(1) ?? '—'}
          </Text>
        </View>

        {/* Book Now */}
        <TouchableOpacity
          onPress={() => router.push(`/item/${item.id}` as any)}
          className="mt-3 rounded-full py-2 items-center"
          style={{ backgroundColor: '#2FA2B9' }}
          activeOpacity={0.8}
        >
          <Text className="text-white text-xs font-bold">Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
