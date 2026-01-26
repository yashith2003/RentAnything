import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

interface ReviewCardProps {
  name: string;
  image: string;
  rating: number;
  comment: string;
  date?: string;
  isVerified?: boolean;
  containerStyle?: string;
}

export default function ReviewCard({
  name,
  image,
  rating,
  comment,
  date,
  isVerified = true,
  containerStyle = '',
}: ReviewCardProps) {
  return (
    <View className={`bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm shadow-black/5 ${containerStyle}`} style={{ elevation: 2 }}>
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-x-3">
          <Image source={{ uri: image }} style={{ width: 35, height: 35, borderRadius: 20 }} />
          <View className="flex-row items-center gap-x-1">
            <Text className="font-bold text-sm text-black">{name}</Text>
            {isVerified && <Ionicons name="checkmark-circle" size={14} color="#3B82F6" />}
          </View>
        </View>
        {date && <Text className="text-gray-400 text-[10px]">{date}</Text>}
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
      
      <Text className="text-gray-400 text-[10px] leading-4" numberOfLines={3}>
        {comment}
      </Text>
    </View>
  );
}
