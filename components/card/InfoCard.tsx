//RentAnything/components/card/InfoCard.tsx

import React from 'react';
import { Text, View } from 'react-native';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  containerStyle?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  containerStyle = '',
}) => {
  return (
    <View 
      className={`bg-white border border-gray-100 rounded-3xl p-4 mb-4 shadow-sm shadow-black/5 ${containerStyle}`}
      style={{ elevation: 2 }}
    >
      <Text className="font-bold text-base text-black mb-4">{title}</Text>
      <View className="w-full h-[1px] bg-gray-100 mb-4" />
      {children}
    </View>
  );
};
