import React from 'react';
import { View, Text } from 'react-native';

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

export const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => {
  if (value === null || value === undefined || value === '') return null;

  return (
    <View className="flex-row justify-between mb-2">
      <Text className="text-xs text-gray-400">{label} :</Text>
      <Text className="text-xs font-semibold text-gray-800">{value}</Text>
    </View>
  );
};
