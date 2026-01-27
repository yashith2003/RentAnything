import RatingStars from '@/components/ui/ratingStars';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

interface OwnerRowProps {
  name: string;
  avatar: string;
  isVerified?: boolean;
  rating?: number;
  showRating?: boolean;
  size?: 'sm' | 'md';
  containerStyle?: string;
}

export default function OwnerRow({
  name,
  avatar,
  isVerified = true,
  rating = 5,
  showRating = true,
  size = 'md',
  containerStyle = '',
}: OwnerRowProps) {
  const avatarSize = size === 'sm' ? 35 : 45;

  return (
    <View className={`flex-row items-center gap-x-3 ${containerStyle}`}>
      <Image 
        source={{ uri: avatar }} 
        style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }} 
      />
      <View>
        <View className="flex-row items-center gap-x-1">
          <Text className={`font-bold ${size === 'sm' ? 'text-xs' : 'text-sm'} text-black`}>
            {name}
          </Text>
          {isVerified && <VerifiedBadge showText={false} size={14} />}
        </View>
        {showRating && (
          <RatingStars rating={rating} size={size === 'sm' ? 10 : 14} />
        )}
      </View>
    </View>
  );
}
