// components/ratingStars.tsx

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  gap?: number;
  style?: ViewStyle;
}

export default function RatingStars({
  rating,
  maxStars = 5,
  size = 20,
  activeColor = '#FF9800',
  inactiveColor = '#E0E0E0',
  gap = 4,
  style,
}: RatingStarsProps) {
  return (
    <View className="flex-row" style={[{ gap }, style]}>
      {[...Array(maxStars)].map((_, index) => (
        <Ionicons
          key={index}
          name="star"
          size={size}
          color={index < rating ? activeColor : inactiveColor}
        />
      ))}
    </View>
  );
}
