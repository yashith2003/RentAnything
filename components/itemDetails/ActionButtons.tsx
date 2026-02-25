import React from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonsProps {
  onCall: () => void;
  onChat: () => void;
  isChatLoading?: boolean;
  isChatDisabled?: boolean;
}

export default function ActionButtons({ onCall, onChat, isChatLoading, isChatDisabled }: ActionButtonsProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white pt-2 pb-8 px-6 flex-row gap-x-4 border-t border-gray-100">
      <TouchableOpacity 
        onPress={onChat}
        disabled={isChatLoading || isChatDisabled}
        className={`w-14 h-14 border border-gray-200 rounded-2xl items-center justify-center ${isChatDisabled ? 'opacity-50' : ''}`}
      >
        {isChatLoading ? (
            <ActivityIndicator size="small" color="#2FA2B9" />
        ) : (
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#666" />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onCall}
        className="flex-1 h-14 bg-cyan-500 rounded-2xl items-center justify-center flex-row gap-x-2"
      >
        <Ionicons name="call-outline" size={20} color="white" />
        <Text className="text-white text-base font-bold">Connect</Text>
      </TouchableOpacity>
    </View>
  );
}
