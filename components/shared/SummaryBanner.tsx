//RentAnything/components/shared/SummaryBanner.tsx

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SummaryBannerProps {
  title: string;
  count: number | string;
  onPress?: () => void;
  containerStyle?: string;
}

export default function SummaryBanner({
  title,
  count,
  onPress,
  containerStyle = '',
}: SummaryBannerProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`mx-6 mb-4 bg-white border border-gray-100 rounded-2xl p-4 flex-row items-center justify-between shadow-sm shadow-black/5 ${containerStyle}`} 
      style={{ elevation: 2 }}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View>
        <Text className="text-base font-bold text-black mb-1">{title}</Text>
        <Text className="text-sm text-gray-400">
          You have {count} {title.toLowerCase().includes('request') ? 'requests' : 'items'} available.
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );
}
