//RentAnything/components/form/SelectionItem.tsx

import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SelectionItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  rightText?: string;
  containerStyle?: string;
}

export const SelectionItem: React.FC<SelectionItemProps> = ({
  icon,
  label,
  onPress,
  rightText = 'Add',
  containerStyle = '',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center justify-between py-${getTailwindSpacing(Spacing.lg)} px-${getTailwindSpacing(Spacing.lg)} mb-3 bg-white border border-gray-200 rounded-2xl ${containerStyle}`}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: '#E6F7F9' }}
        >
          <Ionicons name={icon as any} size={22} color={Colors.primary} />
        </View>
        <Text className="text-base text-black font-medium">{label}</Text>
      </View>

      <Text className="text-base font-semibold" style={{ color: Colors.primary }}>
        {rightText}
      </Text>
    </TouchableOpacity>
  );
};
