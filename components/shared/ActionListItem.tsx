import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ActionListItemProps {
  label: string;
  icon?: string;
  customIcon?: any;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
  rightText?: string;
}

export default function ActionListItem({
  label,
  icon,
  customIcon,
  onPress,
  showChevron = true,
  destructive = false,
  rightText,
}: ActionListItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-gray-50"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center gap-x-3">
        {customIcon ? (
           <Image source={customIcon} style={{ width: 20, height: 20 }} contentFit="contain" />
        ) : icon ? (
          <Ionicons name={icon as any} size={20} color={destructive ? "#FF3B30" : "#6B7280"} />
        ) : null}
        <Text className={`text-sm font-medium ${destructive ? "text-red-500" : "text-gray-700"}`}>
          {label}
        </Text>
      </View>
      <View className="flex-row items-center gap-x-2">
        {rightText && (
          <Text className="text-sm text-gray-400 font-medium">{rightText}</Text>
        )}
        {showChevron && (
          <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
        )}
      </View>
    </TouchableOpacity>
  );
}
