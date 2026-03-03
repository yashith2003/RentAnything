//RentAnything/components/card/ReviewCard.tsx

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';
import { getImageUrl } from '@/utils/image';

interface ReviewCardProps {
  name: string;
  image?: string | null;
  rating: number;
  comment?: string | null;
  date?: string;
  reviewerStatus?: string | null;
  containerStyle?: string;
}

export default function ReviewCard({
  name,
  image,
  rating,
  comment,
  date,
  reviewerStatus,
  containerStyle = '',
}: ReviewCardProps) {
  return (
    <View className={`bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm shadow-black/5 ${containerStyle}`} style={{ elevation: 2 }}>
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-x-3">
          <Image 
            source={image ? { uri: getImageUrl(image) } : require('@/assets/images/profile_icon.avif')} 
            style={{ width: 35, height: 35, borderRadius: 20 }} 
          />
          <View className="flex-row items-center gap-x-1">
            <Text className="font-bold text-sm text-black">{name}</Text>
            {reviewerStatus === 'verified' && <Ionicons name="checkmark-circle" size={14} color="#3B82F6" />}
          </View>
        </View>
        {date && <Text className="text-gray-400 text-xs">{date}</Text>}
      </View>
      
      <View className="flex-row gap-x-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons 
            key={i} 
            name={i < Math.floor(rating) ? "star" : "star-outline"} 
            size={14} 
            color="#FFD700" 
          />
        ))}
      </View>
      
      <Text className="text-gray-500 text-xs leading-5" numberOfLines={3}>
        {comment}
      </Text>
    </View>
  );
}
