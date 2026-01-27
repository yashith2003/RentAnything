import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ActionButtonsProps {
  onCreateBundle: () => void;
  onRequestRent: () => void;
}

export default function ActionButtons({ onCreateBundle, onRequestRent }: ActionButtonsProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white pt-2 pb-8 px-6 flex-row gap-x-4 border-t border-gray-100">
      <TouchableOpacity 
        onPress={onCreateBundle}
        className="flex-1 h-14 border border-cyan-500 rounded-2xl items-center justify-center"
      >
        <Text className="text-cyan-500 font-bold">Create Bundle</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={onRequestRent}
        className="flex-1 h-14 bg-cyan-500 rounded-2xl items-center justify-center"
      >
        <Text className="text-white font-bold">Request for rent</Text>
      </TouchableOpacity>
    </View>
  );
}
