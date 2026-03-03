//RentAnything/components/ui/ProgressBar.tsx

import React from 'react';
import { Text, View } from 'react-native';

interface ProgressBarProps {
  label: string;
  progress: number; // 0 to 100
  subLabel?: string;
  activeColor?: string;
  backgroundColor?: string;
}

export default function ProgressBar({
  label,
  progress,
  subLabel,
  activeColor = '#FB923C', // orange-400
  backgroundColor = '#F3F4F6', // gray-100
}: ProgressBarProps) {
  return (
    <View className="flex-row items-center gap-x-3 mb-2">
      <Text className="text-[10px] text-gray-400 w-4 text-left">{label}</Text>
      <View 
        className="flex-1 h-1.5 rounded-full overflow-hidden" 
        style={{ backgroundColor }}
      >
        <View 
          className="h-full rounded-full" 
          style={{ width: `${progress}%`, backgroundColor: activeColor }} 
        />
      </View>
      {subLabel && (
        <Text className="text-[10px] text-gray-400 min-w-[60px] text-right">{subLabel}</Text>
      )}
    </View>
  );
}
