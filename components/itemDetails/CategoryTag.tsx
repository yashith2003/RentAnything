import React from 'react';
import { View, Text } from 'react-native';

interface CategoryTagProps {
  text: string;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({ text }) => {
  if (!text) return null;

  return (
    <View className="px-3 py-2 border border-gray-100 rounded-lg bg-gray-50">
      <Text className="text-gray-400 text-[10px] font-medium">{text}</Text>
    </View>
  );
};
