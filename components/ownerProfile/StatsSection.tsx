import React from 'react';
import { Text, View } from 'react-native';

interface StatsSectionProps {
  stats: { label: string; value: string }[];
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <View className="flex-row justify-between px-6">
      {stats.map((stat, index) => (
        <View key={index} className="flex-1 items-center p-4 rounded-2xl mx-1">
          <Text className="text-lg font-bold text-black">{stat.value}</Text>
          <Text className="text-[10px] text-gray-400 text-center">{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}
