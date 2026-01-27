import React from 'react';
import { Text, View } from 'react-native';

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  containerStyle?: string;
  labelStyle?: string;
  valueStyle?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  containerStyle = '',
  labelStyle = '',
  valueStyle = '',
}) => {
  return (
    <View className={`flex-row justify-between mb-3 items-center ${containerStyle}`}>
      <Text className={`text-gray-400 text-sm ${labelStyle}`}>{label}</Text>
      {typeof value === 'string' ? (
        <Text className={`text-black font-medium text-sm ${valueStyle}`}>{value}</Text>
      ) : (
        value
      )}
    </View>
  );
};
