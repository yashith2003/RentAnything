import React from 'react';
import { Text, View } from 'react-native';

interface StatsSectionProps {
  stats: { label: string; value: string }[];
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <View className="flex-row justify-between mt-8 px-6">
      {stats.map((stat, index) => (
        <View key={index} className="bg-gray-50 flex-1 items-center p-4 rounded-2xl mx-1 border border-gray-100">
          <Text className="text-lg font-bold text-black">{stat.value}</Text>
          <Text className="text-[10px] text-gray-400 text-center">{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}
