import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/typography';
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
      className="flex-row items-center justify-between py-4"
      activeOpacity={0.7}
      style={{ borderBottomWidth: 1, borderBottomColor: Colors.border }}
    >
      <View className="flex-row items-center gap-x-3">
        {customIcon ? (
           <Image source={customIcon} style={{ width: 20, height: 20 }} contentFit="contain" />
        ) : icon ? (
          <Ionicons name={icon as any} size={20} color={destructive ? Colors.error : Colors.textSecondary} />
        ) : null}
        <Text 
          style={[
            Typography.bodySmall, 
            { fontWeight: '500', color: destructive ? Colors.error : Colors.textPrimary }
          ]}
        >
          {label}
        </Text>
      </View>
      <View className="flex-row items-center gap-x-2">
        {rightText && (
          <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{rightText}</Text>
        )}
        {showChevron && (
          <Ionicons name="chevron-forward" size={18} color={Colors.border} />
        )}
      </View>
    </TouchableOpacity>
  );
}
