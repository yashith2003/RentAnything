import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface VerifiedBadgeProps {
  label?: string;
  size?: number;
  color?: string;
  showText?: boolean;
}

export default function VerifiedBadge({
  label = 'Verified',
  size = 14,
  color = '#3B82F6',
  showText = true,
}: VerifiedBadgeProps) {
  return (
    <View className="flex-row items-center gap-x-1">
      <Ionicons name="checkmark-circle" size={size} color={color} />
      {showText && (
        <Text className="font-bold" style={{ color, fontSize: size - 4 }}>
          {label}
        </Text>
      )}
    </View>
  );
}
